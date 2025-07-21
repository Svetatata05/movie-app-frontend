export interface Movie {
  id: number;
  title: string;
  year: number;
  format: 'VHS' | 'DVD' | 'Blu-Ray';
  actors: string[];
}

export interface NewMovie {
  title: string;
  year: number;
  format: 'VHS' | 'DVD' | 'Blu-Ray';
  actors: string[];
}
