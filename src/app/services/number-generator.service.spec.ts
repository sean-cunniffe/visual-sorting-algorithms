import { TestBed } from '@angular/core/testing';

import { NumberGeneratorService } from './number-generator.service';

describe('NumberGeneratorService', () => {
  let service: NumberGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumberGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
