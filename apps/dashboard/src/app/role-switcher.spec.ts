import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RoleSwitcherComponent } from './role-switcher';
import { setRole } from './state/session/session.actions';
import { selectSessionRole } from './state/session/session.selectors';

describe('RoleSwitcherComponent', () => {
  let component: RoleSwitcherComponent;
  let fixture: ComponentFixture<RoleSwitcherComponent>;
  let store: MockStore;

  const initialState = {
    session: {
      role: 'Owner' as const
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleSwitcherComponent],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            { selector: selectSessionRole, value: 'Owner' }
          ]
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RoleSwitcherComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the current role', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Current Role: Owner');
  });

  it('should have all three role options in the dropdown', () => {
    const compiled = fixture.nativeElement;
    const selectElement = compiled.querySelector('select');
    
    expect(selectElement).toBeTruthy();
    expect(selectElement.options.length).toBe(3);
    expect(selectElement.options[0].value).toBe('Owner');
    expect(selectElement.options[1].value).toBe('Admin');
    expect(selectElement.options[2].value).toBe('Viewer');
  });

  it('should dispatch setRole action when role is changed', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const mockEvent = {
      target: {
        value: 'Admin'
      }
    } as any;

    component.switchRole(mockEvent);

    expect(dispatchSpy).toHaveBeenCalledWith(setRole({ role: 'Admin' }));
  });

  it('should log role changes to console', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const mockEvent = {
      target: {
        value: 'Viewer'
      }
    } as any;

    component.switchRole(mockEvent);

    expect(consoleSpy).toHaveBeenCalledWith('Switching role to:', 'Viewer');
    consoleSpy.mockRestore();
  });

  it('should update displayed role when store state changes', () => {
    // Update the selector value
    store.overrideSelector(selectSessionRole, 'Admin');
    store.refreshState();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Current Role: Admin');
  });

  it('should have correct initial selected value in dropdown', () => {
    const compiled = fixture.nativeElement;
    const selectElement = compiled.querySelector('select');
    
    expect(selectElement.value).toBe('Owner');
  });

  it('should handle role switching to all available roles', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const roles = ['Owner', 'Admin', 'Viewer'] as const;

    roles.forEach(role => {
      const mockEvent = {
        target: {
          value: role
        }
      } as any;

      component.switchRole(mockEvent);
      expect(dispatchSpy).toHaveBeenCalledWith(setRole({ role }));
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(3);
  });

  it('should have proper styling classes', () => {
    const compiled = fixture.nativeElement;
    const roleSwitcherElement = compiled.querySelector('.role-switcher');
    const selectElement = compiled.querySelector('.role-select');
    const currentRoleElement = compiled.querySelector('.current-role');

    expect(roleSwitcherElement).toBeTruthy();
    expect(selectElement).toBeTruthy();
    expect(currentRoleElement).toBeTruthy();
  });

  it('should have proper accessibility attributes', () => {
    const compiled = fixture.nativeElement;
    const labelElement = compiled.querySelector('label');
    const selectElement = compiled.querySelector('select');

    expect(labelElement).toBeTruthy();
    expect(labelElement.getAttribute('for')).toBe('role');
    expect(selectElement.getAttribute('id')).toBe('role');
  });
});
