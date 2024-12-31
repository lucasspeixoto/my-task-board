import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MainListComponent } from '../../components/main-list/main-list.component';
import { ColorsListComponent } from '../../components/colors-list/colors-list.component';
import { CategoryService } from '../../services/category.service';
import { AsyncPipe } from '@angular/common';

const COMPONENTS = [MainListComponent, ColorsListComponent];

const PIPES = [AsyncPipe];

@Component({
    selector: 'app-category',
    imports: [...COMPONENTS, ...PIPES],
    template: `
    <div class="flex flex-col justify-between h-full w-full">
      <!-- main-list -->
      <app-main-list />

      <!-- colors-list -->
      <app-colors-list />
    </div>
  `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {}
