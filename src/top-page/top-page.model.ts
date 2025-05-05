export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products
}

export class TopPageAdvantage {
  title: string;
  description: string;
}

export class TopPageModel {
  firstCategory: TopLevelCategory;
  secondCategory: string;
  title: string;
  category: string;
  hh?: {
    count: number;
    juniorSalary: number;
    middleSalary: number;
    seniorSalary: number;
    updatedAt: Date;
  };
  advantages?: TopPageAdvantage[];
  seoText: string;
  tagsTitle: string;
  tags: string[];
}
