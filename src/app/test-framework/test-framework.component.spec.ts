import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFrameworkComponent } from './test-framework.component';

describe('TestFrameworkComponent', () => {
  let component: TestFrameworkComponent;
  let fixture: ComponentFixture<TestFrameworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestFrameworkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestFrameworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
