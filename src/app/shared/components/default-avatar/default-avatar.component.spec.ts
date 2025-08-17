import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultAvatarComponent } from './default-avatar.component';

describe('DefaultCircleComponent', () => {
  let component: DefaultAvatarComponent;
  let fixture: ComponentFixture<DefaultAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultAvatarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
