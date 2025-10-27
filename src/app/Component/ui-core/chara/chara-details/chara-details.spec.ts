import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharaDetails } from './chara-details';

describe('CharaDetails', () => {
  let component: CharaDetails;
  let fixture: ComponentFixture<CharaDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharaDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharaDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
