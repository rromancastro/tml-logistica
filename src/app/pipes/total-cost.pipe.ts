import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'totalCost',
  pure: true // 🔥 El pipe solo se ejecuta cuando `dataSource` cambia
})
export class TotalCostPipe implements PipeTransform {

  transform(dataSource: any[]): number {
    if (!dataSource || dataSource.length === 0) return 0;
    return dataSource.reduce((acc, item) => acc + (item.total || 0), 0);
  }
}
