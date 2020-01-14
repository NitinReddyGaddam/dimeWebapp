import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'orderBy' })
export class OrderByPipe implements PipeTransform {

    transform(records: Array<any>, args?: any): any {
        if(args.property == 'createdDate') {
            return records.sort(function (a, b) {
                if (new Date(a[args.property]) < new Date(b[args.property])) {
                    return -1 * args.direction;
                }
                else if (new Date(a[args.property]) > new Date(b[args.property])) {
                    return 1 * args.direction;
                }
                else {
                    return 0;
                }
            });
        }
        else if(args.property == 'id') {
            return records.sort(function (a, b) {
                if (a[args.property] < b[args.property]) {
                    return -1 * args.direction;
                }
                else if (a[args.property] > b[args.property]) {
                    return 1 * args.direction;
                }
                else {
                    return 0;
                }
            });
        }
        else {
            return records.sort(function (a, b) {
                if (a[args.property].toLowerCase() < b[args.property].toLowerCase()) {
                    return -1 * args.direction;
                }
                else if (a[args.property].toLowerCase() > b[args.property].toLowerCase()) {
                    return 1 * args.direction;
                }
                else {
                    return 0;
                }
            });
        }
    };
}