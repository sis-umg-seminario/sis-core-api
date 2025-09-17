import { GetEligibleCoursesResponseDto } from '@academic/dtos/responses/get-eligible-courses-response.dto';
import { AcademicTerm } from '@academic/entities/academic-term.entity';
import { Course } from '@academic/entities/course.entity';
import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentResourcesService } from '@payments/services/payment-resources.service';
import { StudentHistory } from '@students/entities/student-history.entity';
import { isCourseEligible } from '@academic/utils/is-course-eligible';
import { StudentsService } from '@students/services/students.service';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { EnrollmentsService } from '@enrollments/services/enrollments.service';

@Injectable()
export class AcademicService {
  constructor(
    private readonly paymentResourcesService: PaymentResourcesService,
    private readonly studentsService: StudentsService,
    @InjectRepository(AcademicTerm)
    private readonly academicTermRepository: Repository<AcademicTerm>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @Inject(forwardRef(() => EnrollmentsService))
    private readonly enrollmentsService: EnrollmentsService,
  ) {}
  public async getEligibleCourses(
    studentId: number,
    termType: string,
    startMonth: number,
    paymentCode: number,
  ) {
    await this.enrollmentsService.validateStudentHasActiveEnrollment(studentId);

    const paymentTypeId =
      await this.paymentResourcesService.getPaymentType('ENROLLMENT');

    await this.paymentResourcesService.validatePayment(
      paymentTypeId,
      paymentCode,
    );

    const programId = await this.studentsService.getEnrolledCareer(studentId);

    const academicTerm = await this.searchAcademicTerm(termType, startMonth);

    if (!academicTerm) {
      throw new HttpException(
        {
          message:
            'No se encontró un período académico para los criterios dados',
        },
        404,
      );
    }
    const courseOfferingsAndPrerequisites =
      await this.getCourseOfferingsAndPrerequisites(
        academicTerm.termId,
        programId,
      );

    const studentHistory =
      await this.studentsService.getStudentHistory(studentId);

    const eligibleCourses = this.getEligibleCoursesToEnroll(
      courseOfferingsAndPrerequisites,
      studentHistory,
    );

    return plainToInstance(
      GetEligibleCoursesResponseDto,
      { eligibleCourses, programId, academicTermId: academicTerm.termId },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  public async getCourseOfferingsAndPrerequisitesByIds(offeringIds: number[]) {
    return this.courseRepository
      .createQueryBuilder('c')
      .innerJoinAndSelect('c.offerings', 'co', 'co.offeringId IN (:...ids)', {
        ids: offeringIds,
      })
      .innerJoinAndSelect('c.coursePrerequisites', 'cp')
      .getMany();
  }

  public async getAcademicTerm(termId: number): Promise<AcademicTerm> {
    const result = await this.academicTermRepository.findOne({
      where: { termId },
      relations: ['termType'],
    });

    if (!result) {
      throw new HttpException(
        { message: `No se encontró el período académico con ID ${termId}` },
        404,
      );
    }

    return result;
  }

  public async calculateAndReturnTotalCourseFees(
    courseIds: number[],
    programId: number,
  ): Promise<number> {
    const result = await this.courseRepository
      .query(`select SUM(fd.amount) as total_fee from academic.course ac right join academic.fee_definition fd
        on ac.course_id = fd.course_id
        where ac.course_id IN(${courseIds.join(',')}) and fd.program_id = ${programId};`);

    if (!result.length) {
      throw new HttpException(
        { message: `Error al obtener las tarifas de los cursos seleccionados` },
        400,
      );
    }

    return result[0].total_fee;
  }

  private async searchAcademicTerm(termTypeName: string, startMonth: number) {
    return this.academicTermRepository
      .createQueryBuilder('at')
      .select('at.termId')
      .leftJoin('at.termType', 'tt')
      .where('tt.name = :termTypeName', { termTypeName })
      .andWhere('EXTRACT(MONTH FROM at.start_date) = :month', {
        month: startMonth,
      })
      .getOne();
  }

  private async getCourseOfferingsAndPrerequisites(
    academicTermId: number,
    programId: number,
  ) {
    return this.courseRepository
      .createQueryBuilder('c')
      .innerJoinAndSelect(
        'c.offerings',
        'co',
        'co.programId = :programId AND co.termId = :termId',
        { programId, termId: academicTermId },
      )
      .innerJoinAndSelect('c.coursePrerequisites', 'cp')
      .getMany();
  }

  private getEligibleCoursesToEnroll(
    courses: Course[],
    studentHistory: StudentHistory[],
  ): Course[] {
    const eligibleCourses: Course[] = [];
    for (const course of courses) {
      if (isCourseEligible(course, studentHistory)) {
        eligibleCourses.push(course);
      }
    }
    return eligibleCourses;
  }
}
