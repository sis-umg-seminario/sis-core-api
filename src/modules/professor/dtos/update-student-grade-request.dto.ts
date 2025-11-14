export class UpdateStudentGradeRequestDto {
  scores: ScoresRequestDto[];
}

class ScoresRequestDto {
  type: string;
  value: number;
}
