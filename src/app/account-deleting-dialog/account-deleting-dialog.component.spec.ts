import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDeletingDialogComponent } from './account-deleting-dialog.component';

describe('AccountDeletingDialogComponent', () => {
  let component: AccountDeletingDialogComponent;
  let fixture: ComponentFixture<AccountDeletingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountDeletingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDeletingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
