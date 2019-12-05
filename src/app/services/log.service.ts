import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable({
    providedIn: 'root'
})
export class LogService {

    constructor(
        private logger: NGXLogger
      ) { }
    
    info(_this: Object , ...msg) {
      if(_this) {
        this.logger.info(_this.constructor.name ,'>>>>>>', ...msg)
      }
    }
    
    error(_this,...msg) {
      if(_this) {
        this.logger.error(_this.constructor.name ,'>>>>>>', ...msg)
      }
    }

    fatal(_this: Object , ...msg) {
      if(_this) {
        this.logger.fatal(_this.constructor.name ,'>>>>>>', ...msg)
      }
    }    
}