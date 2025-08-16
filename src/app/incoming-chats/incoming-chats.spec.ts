import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingChats } from './incoming-chats';

describe('IncomingChats', () => {
  let component: IncomingChats;
  let fixture: ComponentFixture<IncomingChats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingChats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingChats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
