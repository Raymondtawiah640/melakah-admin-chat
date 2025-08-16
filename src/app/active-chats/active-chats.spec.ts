import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveChats } from './active-chats';

describe('ActiveChats', () => {
  let component: ActiveChats;
  let fixture: ComponentFixture<ActiveChats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveChats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveChats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
