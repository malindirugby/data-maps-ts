export type JSSGrade = ('grade_6' | 'grade_7' | 'grade_8' | 'grade_9')[];
export type SeniorSchoolGrade = ('grade_10' | 'grade_11' | 'grade_12')[];


export type SchoolGrade =
    | 'grade_6'
    | 'grade_7'
    | 'grade_8'
    | 'grade_9'
    | 'grade_10'
    | 'grade_11'
    | 'grade_12';

export type SchoolGradeLevel = SchoolGrade[];

// For category-specific validation, use a discriminated union instead:

export type SchoolGradeSelection =
| { category: 'junior_secondary'; gradeLevel: JSSGrade }
| { category: 'senior_school'; gradeLevel: SeniorSchoolGrade }
| { category: 'combined_jss_senior'; gradeLevel: SchoolGrade[] };
