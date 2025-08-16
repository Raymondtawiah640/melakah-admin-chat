import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedChats } from './completed-chats';

describe('CompletedChats', () => {
  let component: CompletedChats;
  let fixture: ComponentFixture<CompletedChats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedChats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedChats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
