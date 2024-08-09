import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';

import {Exercise} from '../types'

const defaultList = [
  {
      "userName": "test",
      "workoutType": "Weightlifting",
      "workoutMinutes": 147,
      "count": 2
  },
  {
      "userName": "test",
      "workoutType": "Bodyweight Exercises",
      "workoutMinutes": 58,
      "count": 2
  },
  {
      "userName": "Ravi",
      "workoutType": "Running/Jogging",
      "workoutMinutes": 60,
      "count": 2
  },
  {
      "userName": "Ravi",
      "workoutType": "Swimming",
      "workoutMinutes": 20,
      "count": 1
  },
  {
      "userName": "Ravi",
      "workoutType": "Yoga",
      "workoutMinutes": 50,
      "count": 1
  },
  {
      "userName": "Kishan",
      "workoutType": "Pilates",
      "workoutMinutes": 45,
      "count": 1
  },
  {
      "userName": "kishan",
      "workoutType": "Dynamic Stretching",
      "workoutMinutes": 23,
      "count": 1
  },
  {
      "userName": "kishan",
      "workoutType": "Resistance Bands",
      "workoutMinutes": 444,
      "count": 1
  },
  {
      "userName": "Rahul",
      "workoutType": "Medicine Ball Workouts",
      "workoutMinutes": 20,
      "count": 1
  },
  {
      "userName": "Rahul",
      "workoutType": "Cycling",
      "workoutMinutes": 50,
      "count": 1
  },
  {
      "userName": "Rahul",
      "workoutType": "Swimming (Endurance)",
      "workoutMinutes": 60,
      "count": 1
  },
  {
      "userName": "Manish",
      "workoutType": "Zumba",
      "workoutMinutes": 60,
      "count": 1
  },
  {
      "userName": "Manish",
      "workoutType": "Dynamic Stretching",
      "workoutMinutes": 20,
      "count": 1
  },
  {
      "userName": "Shubham",
      "workoutType": "Power Yoga",
      "workoutMinutes": 40,
      "count": 1
  },
  {
      "userName": "Shubham",
      "workoutType": "Pilates",
      "workoutMinutes": 300,
      "count": 1
  },
  {
      "userName": "shubham",
      "workoutType": "Walking",
      "workoutMinutes": 56,
      "count": 1
  },
  {
      "userName": "shubham",
      "workoutType": "Long-Distance Running",
      "workoutMinutes": 50,
      "count": 1
  }
]

localStorage.setItem('workouts', JSON.stringify(defaultList));


const Exercises: Exercise[] = JSON.parse(
  localStorage.getItem('workouts') || '[]'
).reverse();

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements AfterViewInit {
  displayedColumns: string[] = ['userName', 'workoutType', 'count', 'workoutMinutes'];
  dataSource;
  selectedWorkoutType: string | null = null; 
  searchValue: string | null = null;
  workout_types: string[] = [
    'Weightlifting',
    'Bodyweight Exercises',
    'Resistance Bands',
    'Running/Jogging',
    'Cycling',
    'Swimming',
    'Rowing',
    'Jump Rope',
    'Tabata',
    'Circuit Training',
    'Yoga',
    'Pilates',
    'Dynamic Stretching',
    'TRX Suspension Training',
    'Kettlebell Workouts',
    'Medicine Ball Workouts',
    'Long-Distance Running',
    'Cycling (Endurance)',
    'Swimming (Endurance)',
    'Boxing',
    'Martial Arts',
    'CrossFit',
    'Walking',
    'Elliptical Training',
    'Aqua Aerobics',
    'Tai Chi',
    'Qigong',
    'Zumba',
    'Spinning',
    'BodyPump',
    'Boot Camp',
    'Power Yoga',
    'Barre',
  ];

  workoutForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.workoutForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      workoutType: ['', Validators.required],
      workoutMinutes: [
        '',
        [Validators.required, Validators.min(1), Validators.max(500)],
      ],
    });

    this.dataSource = new MatTableDataSource<Exercise>(Exercises);
  }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onWorkoutTypeChange(event: any): void {
    const selectedWorkout = event.value;
    this.dataSource.filter = selectedWorkout.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  resetWorkoutType(): void {
    this.selectedWorkoutType = null; 
    this.searchValue = '';
    this.dataSource = new MatTableDataSource<Exercise>(Exercises);
  }

  goToCharts() {
    this.router.navigate(['chart'], { relativeTo: this.route });
  }

  saveWorkout() {
    if (this.workoutForm.valid) {
      const formData = this.workoutForm.value;
      const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
  
      const existingWorkout = workouts.find((workout: any) =>
        workout.userName === formData.userName && workout.workoutType === formData.workoutType
      );
  
      if (existingWorkout) {
        existingWorkout.workoutMinutes += formData.workoutMinutes;
        existingWorkout.count += 1;
      } else {
        workouts.push({
          userName: formData.userName,
          workoutType: formData.workoutType,
          workoutMinutes: formData.workoutMinutes,
          count: 1
        });
      }
  
      localStorage.setItem('workouts', JSON.stringify(workouts));
  
      this.workoutForm.reset();
      this.workoutForm.setErrors(null);
      this.workoutForm.markAsPristine();
      this.workoutForm.markAsUntouched();
  
      this.dataSource.data = JSON.parse(localStorage.getItem('workouts') || '[]').reverse();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      alert('Please fill out the form correctly.');
    }
  }
  
  get f() {
    return this.workoutForm.controls;
  }
}
