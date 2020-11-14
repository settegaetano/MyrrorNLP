import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { isNullOrUndefined } from 'util';

const API_LINK_ACCOUNT = 'api/telegram/link_account';
const API_CONFIG = 'api/telegram/config';
const API_DELETE_ACCOUNT = 'api/telegram/delete';
const API_USER_DIAGNOSIS = 'api/telegram/diagnosis';
const API_USER_ANALYSIS = 'api/telegram/analysis';
const API_USER_THERAPY = 'api/telegram/therapy';
const API_USER_MEDICALAREA = 'api/telegram/medicalArea';
const API_USER_MEDICALVISIT = 'api/telegram/medicalVisit';
const API_USER_DISEASE = 'api/telegram/disease';
const API_USER_HOSPITALIZATION = 'api/telegram/hospitalization';


const FIVE_MINUTES_MILLIS = 5 * 60 * 1000;

@Injectable()
export class TelegramService {

  private url: string;

  // timeout variables
  private lastUpdateProfile: number;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.url = environment.api;
    this.lastUpdateProfile = Date.now() - FIVE_MINUTES_MILLIS;
  }

  linkAccount(username: string): Observable<any> {
    const postParams = {
      username: username,
      mirrorUsername: this.authService.getUserame(),
    };

    return this.http.post(`${this.url}${API_LINK_ACCOUNT}`, postParams);
  }

   /**
   * Send Instagram configuration to update.
   * @param option: share options
   * @return {Observable<Object>}
   */
  configuration(option: {shareTherapy?: boolean, shareAnalysis?: boolean, shareMedicalArea?: boolean, shareDiagnosis?: boolean, shareMedicalVisit?: boolean, shareDisease?: boolean, shareHospitalization?: boolean}): Observable<any> {
    let params = '?';

    if (!isNullOrUndefined(option.shareTherapy)) {
      params += 'shareTherapy=' + option.shareTherapy + '&';
    }

    if (!isNullOrUndefined(option.shareAnalysis)) {
      params += 'shareAnalysis=' + option.shareAnalysis + '&';
    }
    if (!isNullOrUndefined(option.shareMedicalArea)) {
      params += 'shareMedicalArea=' + option.shareMedicalArea + '&';
    }

    if (!isNullOrUndefined(option.shareDiagnosis)) {
      params += 'shareDiagnosis=' + option.shareDiagnosis + '&';
    }

    if (!isNullOrUndefined(option.shareMedicalVisit)) {
      params += 'shareMedicalVisit=' + option.shareMedicalVisit + '&';
    }

    if (!isNullOrUndefined(option.shareDisease)) {
      params += 'shareDisease=' + option.shareDisease + '&';
    }

    if (!isNullOrUndefined(option.shareHospitalization)) {
      params += 'shareHospitalization=' + option.shareHospitalization + '&';
    }

    return this.http.get(`${this.url}${API_CONFIG}${params}`);
  }

   /**
   * Delete user telegram account.
   * @return {Observable<Object>}
   */
  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.url}${API_DELETE_ACCOUNT}`);
  }

  userDiagnoses(diagnosisToRead?: Number): Observable<any>  {
    
      const postParams = {
        diagnosisNumber: diagnosisToRead,
      }
      return this.http.post(`${this.url}${API_USER_DIAGNOSIS}`, postParams);
  }

  userAnalyses(analysisToRead?: Number): Observable<any>  {
    
    const postParams = {
      analysisNumber: analysisToRead,
    }
    return this.http.post(`${this.url}${API_USER_ANALYSIS}`, postParams);
}

userTherapy(therapyToRead?: Number): Observable<any>  {
    
  const postParams = {
    therapyNumber: therapyToRead,
  }
  return this.http.post(`${this.url}${API_USER_THERAPY}`, postParams);
}

userMedicalArea(medicalAreaToRead?: Number): Observable<any>  {
    
  const postParams = {
    medicalAreaNumber: medicalAreaToRead,
  }
  return this.http.post(`${this.url}${API_USER_MEDICALAREA}`, postParams);
}

userMedicalVisit(medicalVisitToRead?: Number): Observable<any>  {
    
  const postParams = {
    medicalVisitNumber: medicalVisitToRead,
  }
  return this.http.post(`${this.url}${API_USER_MEDICALVISIT}`, postParams);
}

userDisease(diseaseToRead?: Number): Observable<any>  {
    
  const postParams = {
    diseaseNumber: diseaseToRead,
  }
  return this.http.post(`${this.url}${API_USER_DISEASE}`, postParams);
}


userHospitalization(hospitalizationToRead?: Number): Observable<any>  {
    
  const postParams = {
    hospitalizationNumber: hospitalizationToRead,
  }
  return this.http.post(`${this.url}${API_USER_HOSPITALIZATION}`, postParams);
}

}
