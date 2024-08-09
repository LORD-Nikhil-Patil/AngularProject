import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { LandingComponent } from './landing.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let router: Router;
  const defaultList = [
    {
        "userName": "test",
        "workoutType": "Weightlifting",
        "workoutMinutes": 147,
        "count": 2
    },
  ]
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LandingComponent,
        ReactiveFormsModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        RouterTestingModule.withRoutes([]),
        NoopAnimationsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when all required fields are filled', () => {
    component.workoutForm.controls['userName'].setValue('John Doe');
    component.workoutForm.controls['workoutType'].setValue('Running');
    component.workoutForm.controls['workoutMinutes'].setValue(30);

    expect(component.workoutForm.valid).toBeTrue();
  });

  it('should have an invalid form if userName is less than 3 characters', () => {
    component.workoutForm.controls['userName'].setValue('Jo');
    component.workoutForm.controls['workoutType'].setValue('Running');
    component.workoutForm.controls['workoutMinutes'].setValue(30);

    expect(component.workoutForm.invalid).toBeTrue();
  });

  it('should filter the data based on workout type', () => {
    const event = { value: 'Running' };
    component.onWorkoutTypeChange(event);
    fixture.detectChanges();

    expect(component.dataSource.filteredData.length).toBeLessThan(
      component.dataSource.data.length
    );
  });

  it('should reset workout type filter', () => {
    component.resetWorkoutType();
    fixture.detectChanges();

    expect(component.selectedWorkoutType).toBeNull();
    expect(component.dataSource.filteredData.length).toEqual(
      component.dataSource.data.length
    );
  });

  it('should apply text filter on the data', () => {
    const event = { target: { value: 'Ravi' } } as unknown as Event;
    component.applyFilter(event);
    fixture.detectChanges();

    expect(component.dataSource.filteredData.length).toBe(3); // Expect 3 records with the name 'Ravi'
  });

  it('should save workout correctly in localStorage', () => {
    component.workoutForm.controls['userName'].setValue('John Doe');
    component.workoutForm.controls['workoutType'].setValue('Running');
    component.workoutForm.controls['workoutMinutes'].setValue(30);

    component.saveWorkout();
    const storedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');

    expect(storedWorkouts.length).toBeGreaterThan(0);
    expect(storedWorkouts[storedWorkouts.length - 1].userName).toEqual('John Doe');
    expect(storedWorkouts[storedWorkouts.length - 1].workoutMinutes).toEqual(30);
  });

  it('should not save workout if form is invalid', () => {
    spyOn(window, 'alert');

    component.workoutForm.controls['userName'].setValue('Jo');
    component.workoutForm.controls['workoutType'].setValue('');
    component.workoutForm.controls['workoutMinutes'].setValue(0);

    component.saveWorkout();
    expect(window.alert).toHaveBeenCalledWith('Please fill out the form correctly.');
  });

  it('should navigate to chart view on goToCharts call', () => {
    spyOn(router, 'navigate');
    component.goToCharts();

    expect(router.navigate).toHaveBeenCalledWith(['chart'], { relativeTo: component.route });
  });


  it('should paginate data correctly', () => {
    component.dataSource.paginator?.firstPage();
    fixture.detectChanges();

    expect(component.dataSource.paginator?.pageIndex).toBe(0);
  });
});
