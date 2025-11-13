export interface ProfileInformationDto {
  studentId: number;
  userId: number;
  professorId: number;
  firstName: string;
  lastName: string;
  name: string;
  professionalTitle: string;
  dateOfBirth: string;
  email: string;
  status: string;
  createdAt: string;
  studentPrograms: StudentProgramDto[];
}

export interface StudentProgramDto {
  studentProgramId: number;
  studentId: number;
  programId: number;
  startDate: string;
  endDate: any;
  status: string;
  createdAt: string;
  program: ProgramDto;
}

export interface ProgramDto {
  programId: number;
  name: string;
  description: string;
  enrollmentFee: string;
  createdAt: string;
}
