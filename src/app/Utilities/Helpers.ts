import { isPlatformBrowser } from "@angular/common";
import * as moment from 'jalali-moment';
//import { Options } from "selenium-webdriver";

export class helper {

    static getGeorgianDate(persianStringDate: string): Date {
        if (!persianStringDate) return null;

        const x = moment(persianStringDate, 'jYYYY/jM/jD HH:mm').format('YYYY-M-D HH:mm:ss');
        const y = moment.from(persianStringDate, 'fa', 'YYYY/M/D HH:mm').locale('en').format('YYYY-M-D HH:mm:ss');
        const w = moment.from(persianStringDate, 'fa', 'jYYYY/jM/jD HH:mm').locale('en').format('YYYY-M-D HH:mm:ss');
        
        return new Date(y);
    }

    static getPersianDate(date: Date): string {
        if (!date)
            return '';
        
        return moment.from(date.toString(), 'en', 'YYYY-MM-DD HH:mm').locale('fa').format('YYYY-MM-DD HH:mm');        
    }

    test(str: string) {

        moment.from('1392/6/3 16:40', 'fa', 'YYYY/M/D HH:mm')
            .format('YYYY-M-D HH:mm:ss'); // 2013-8-25 16:40:00
    }

}

//persianStringDate = 1400-06-14 15:30       
//Date.parse(persianStringDate) = -17973230144000        
//new Date(persianStringDate).toLocaleString() = 6/14/1400, 3:30:00 PM
// x= moment(persianStringDate, 'jYYYY/jM/jD HH:mm').format('YYYY-M-D HH:mm:ss') = 1400-6-14 15:30:00 , 
// new Date(x) = Sat Jun 14 1400 15:30:00 GMT+0325 (Iran Daylight Time)
// new Date(x + 'Z') = Sat Jun 14 1400 18:55:44 GMT+0325 (Iran Daylight Time) XXXXXXXXXXXX ALL WRONG

/*
Georgian: x 1400-6-14 15:30:00, Date: Sat Jun 14 1400 15:30:00 GMT+0325 (Iran Daylight Time),~~~~ Sat Jun 14 1400 18:55:44 GMT+0325 (Iran Daylight Time)
        
@@@@ y 1400-6-14 15:30:00, Georgian: Sat Jun 14 1400 15:30:00 GMT+0325 (Iran Daylight Time) 
        
@@@@ w 1400-6-14 15:30:00, Georgian: Sat Jun 14 1400 15:30:00 GMT+0325 (Iran Daylight Time) , ..z: Sat Jun 14 1400 18:55:44 GMT+0325 (Iran Daylight Time)
*/
/*
Georgian: x 1400-6-14 15:30:00, Date: Sat Jun 14 1400 15:30:00 GMT+0325 (Iran Daylight Time),~~~~ Sat Jun 14 1400 18:55:44 GMT+0325 (Iran Daylight Time)
        
@@@@ y 2021-9-5 15:30:00, Georgian: Sun Sep 05 2021 15:30:00 GMT+0430 (Iran Daylight Time),~~~~ Sun Sep 05 2021 20:00:00 GMT+0430 (Iran Daylight Time) 
        
@@@@ w 2021-9-5 15:30:00, Georgian: Sun Sep 05 2021 15:30:00 GMT+0430 (Iran Daylight Time) , ..z: Sun Sep 05 2021 20:00:00 GMT+0430 (Iran Daylight Time)
*/

// const z = moment(persianStringDate, 'jYYYY/jM/jD HH:mm').format('YYYY-M-DTHH:mm:ss');
//۱۴۰۰/۶/۱۸،‏ ۱۰:۳۵:۰۰
        
// console.log(`persian string: ${persianStringDate}, 
// \r\nGeorgian: x ${x}, Date: ${new Date(x)},~~~~ ${new Date(x + 'Z')}
// \r\n@@@@ y ${y}, Georgian: ${new Date(y)},~~~~ ${new Date(y + 'Z')} 
// \r\n@@@@ w ${w}, Georgian: ${new Date(w)} , ..z: ${new Date(w + 'Z')}`);

//----------------------------------------------------


//date=2021-09-05T15:30:00 
        //moment.from(date.toString(), 'fa', 'jYYYY/jM/jD HH:mm').format() = 2642-11-26T15:30:00+03:30 !!! XXXX
        //moment.from(date.toString(), 'en', 'YYYY-MM-DD HH:mm').format() = 2021-09-05T15:30:00+04:30
        //moment.from(date.toString(), 'en', 'YYYY-MM-DD HH:mm').locale('fa').format() = 1400-06-14T15:30:00+04:30
        //moment.from(date.toString(), 'en', 'YYYY-MM-DD HH:mm').locale('fa').format('YYYY-MM-DD HH:mm') = 1400-06-14 15:30 YESSSS
        
        
        // console.log('get persian', date, '\r\n**',
        //     moment.from(date.toString(), 'en', 'YYYY-MM-DD HH:mm').locale('fa').format('YYYY-MM-DD HH:mm'));

        //return new Date(date).toLocaleString('fa-IR');
        //return new Date(date).toLocaleDateString('fa-IR')+ new Date(date).toLocaleTimeString('fa-IR');
        // moment('2013-8-25 16:40:00', 'YYYY-M-D HH:mm:ss')
        // .locale('fa')
        // .format('YYYY/M/D HH:mm:ss'); // 1392/6/31 23:59:59