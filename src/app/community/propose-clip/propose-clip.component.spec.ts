import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposeClipComponent } from './propose-clip.component';

describe('ProposeClipComponent', () => {
  let component: ProposeClipComponent;
  let fixture: ComponentFixture<ProposeClipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProposeClipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposeClipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
