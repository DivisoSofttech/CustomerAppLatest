
import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  production: true,
  logging: {
    level: NgxLoggerLevel.OFF,
    enableSourceMaps: true
  }
};
