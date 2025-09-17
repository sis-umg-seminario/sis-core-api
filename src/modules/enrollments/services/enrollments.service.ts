import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { AcademicService } from '@academic/services/academic.service';
import { EnrollStudentRequestDto } from '@enrollments/domain/dtos/enroll-student-request.dto';
import { PaymentResourcesService } from '@payments/services/payment-resources.service';
import { StudentsService } from '@students/services/students.service';
import { isCourseEligible } from '@academic/utils/is-course-eligible';
import { Course } from '@academic/entities/course.entity';
import { StudentHistory } from '@students/entities/student-history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from '@enrollments/enrollments/enrollment.entity';
import { Repository } from 'typeorm';
import { getMonth } from '@enrollments/utils/get-month';
import { PaymentOrder } from '@payments/entities/payment-order.entity';
import { EnrollmentStatus } from '@enrollments/domain/enums/enrollment-status.enum';
import { CourseOfferingStatus } from '@enrollments/domain/enums/course-offering-status.enum';

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly paymentResourcesService: PaymentResourcesService,
    @Inject(forwardRef(() => AcademicService))
    private readonly academicService: AcademicService,
    private readonly studentsService: StudentsService,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  public async enrollStudent(input: EnrollStudentRequestDto) {
    const { studentId, termId, programId, paymentCode, offeringCourses } =
      input;
    await this.validateStudentHasActiveEnrollment(studentId);

    const paymentTypeId =
      await this.paymentResourcesService.getPaymentType('ENROLLMENT');

    await this.paymentResourcesService.validatePayment(
      paymentTypeId,
      paymentCode,
    );

    const coursesToEnroll =
      await this.academicService.getCourseOfferingsAndPrerequisitesByIds(
        offeringCourses.map((c) => c.offeringId),
      );

    const studentHistory =
      await this.studentsService.getStudentHistory(studentId);

    this.validateCoursesToEnroll(coursesToEnroll, studentHistory);

    const academicTerm = await this.academicService.getAcademicTerm(termId);

    const totalCourseFee =
      await this.academicService.calculateAndReturnTotalCourseFees(
        coursesToEnroll.map((course) => course.courseId),
        programId,
      );

    const monthlyPaymentTypeId =
      await this.paymentResourcesService.getPaymentType('MONTHLY');

    const registeredEnrollment = await this.enrollmentRepository.save({
      studentId,
      termId,
      programId,
      enrollmentDate: new Date(),
      status: EnrollmentStatus.ACTIVE,
      enrollmentCourses: offeringCourses.map((course) => ({
        offeringId: course.offeringId,
        status: CourseOfferingStatus.ENROLLED,
      })),
    });

    const paymentOrders = Array.from({
      length: academicTerm.termType.durationMonths,
    }).map(
      (_, index) =>
        ({
          studentId,
          paymentTypeId: monthlyPaymentTypeId,
          totalAmount: totalCourseFee,
          dueDate: new Date(
            new Date().setMonth(new Date().getMonth() + index + 1),
          ),
          status: 'PENDING',
          description: getMonth(academicTerm.startDate.getMonth() + index),
          contextId: registeredEnrollment.enrollmentId,
        }) as Partial<PaymentOrder>,
    );

    await this.paymentResourcesService.savePaymentOrders(paymentOrders);

    return { message: 'Estudiante inscrito exitosamente' };
  }

  public async validateStudentHasActiveEnrollment(
    studentId: number,
  ): Promise<void> {
    const activeEnrollment = await this.enrollmentRepository.findOne({
      where: { studentId, status: EnrollmentStatus.ACTIVE },
    });

    if (activeEnrollment) {
      throw new HttpException(
        { message: 'El estudiante ya tiene una inscripción activa' },
        400,
      );
    }
  }

  private validateCoursesToEnroll(
    courses: Course[],
    studentHistory: StudentHistory[],
  ) {
    for (const course of courses) {
      const isEligible = isCourseEligible(course, studentHistory);
      if (!isEligible) {
        throw new HttpException(
          {
            message: `El estudiante no cumple los requisitos para inscribirse en el curso ${course.name}`,
          },
          400,
        );
      }
    }
  }
}
