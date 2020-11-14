import {Component, OnInit} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {ConfirmDialogComponent} from '../../../components/confirm-dialog/confirm-dialog.component';
import {environment} from '../../../../environments/environment';
import { TelegramService } from '../../../services/telegram.service';




@Component({
  selector: 'app-telegram',
  templateUrl: './telegram.component.html',
  styleUrls: ['./telegram.component.scss']
})
export class TelegramComponent implements OnInit {

  /**
   * Current logged user.
   */
  user: any;

  /**
   * True if something is loading.
   */
  loading = true;

  /**
   * True if posts are loading.
   */
  loadingDiagnoses = false;

  loadingAnalyses = false;

  loadingTherapies = false;

  loadingMedicalArea = false;

  loadingMedicalVisit = false;

  loadingDisease = false;

  loadingHospitalization = false;




  /**
   * Share Diagnosis.
   */
  shareDiagnosis: boolean;

  /**
   * Share Therapy.
   */
  shareTherapy: boolean;

  /**
   * Share Analysis.
   */
  shareAnalysis: boolean;

  /**
   * Share Medical Area.
   */
  shareMedicalArea: boolean;

  /**
   * Share Medical Visit.
   */
  shareMedicalVisit: boolean;

  /**
   * Share Disease.
   */
  shareDisease: boolean;

  /**
   * Share Hospitalization.
   */
  shareHospitalization: boolean;

  
  
  /**
   * Application name.
   */
  appName: string;
  /**
   * Diagnoses array.
   */
  diagnoses: any[] = [];

   /**
   * Analyses array.
   */
  analyses: any [] = [];

   /**
   * Analyses array.
   */
  therapies: any [] = [];

  /**
   * Medical Area array
   */
  medicalArea: any[] = [];

  /**
   * Medical Visit array
   */
  medicalVisit: any[] = [];

  /**
   * Disease array
   */
  disease: any[] = [];

  /**
   * Hospedalization array
   */
  hospitalization: any[] = [];


  /**
   * Telegram username
   */
  telegramUsername: string = "";

  // data source containing user Telegram profile data
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['dataName', 'dataValue'];

  constructor(private telegramService: TelegramService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog,) { 
      this.appName = environment.appName;
    }

  ngOnInit(): void { 
    this.authService.getUser().then((user) => {
      if (user && user.identities && user.identities.telegram) {

              ////////dentro if

              this.loading= false;
              this.user = user;
              this.setupTelegramProfileTable();
              this.updateMedicalArea(false, 5);
              this.updateDiagnoses(false, 5);
              this.updateAnalyses(false, 5);
              this.updateTherapies(false, 5);
              this.updateMedicalVisit(false, 5);
              this.updateDisease(false, 5);
              this.updateHospitalization(false, 5);
              


              this.shareAnalysis = user.identities.configs.telegramConfig.shareAnalysis;
              if (this.shareAnalysis == true){
                this. updateAnalyses();
              }
              this.shareDiagnosis = user.identities.configs.telegramConfig.shareDiagnosis;
              if(this.shareDiagnosis == true){
                this.updateDiagnoses();
              }
              this.shareMedicalArea = user.identities.configs.telegramConfig.shareMedicalArea;
              if(this.shareMedicalArea == true){
                this.updateMedicalArea();
              }
              this.shareTherapy = user.identities.configs.telegramConfig.shareTherapy;
              if(this.shareTherapy == true){
                this.updateTherapies();
              }
              this.shareMedicalVisit = user.identities.configs.telegramConfig.shareMedicalVisit;
              if(this.shareMedicalVisit == true){
                this.updateMedicalVisit();
              }
              this.shareDisease = user.identities.configs.telegramConfig.shareDisease;
              if(this.shareDisease == true){
                this.updateDisease();
              }
              this.shareHospitalization = user.identities.configs.telegramConfig.shareHospitalization;
              if(this.shareHospitalization == true){
                this.updateHospitalization();
              }

        
               // clean the URL
        window.history.replaceState(null, null, window.location.pathname);
      }

      else{
              this.loading= false;
      }
    
    
    
    }
    );//fine then 
    
  }

  associate(){
    this.telegramService.linkAccount(this.telegramUsername).subscribe(
      (res) => {
        if (res.username == "This username does not exist"){
          this.toast.error(res.username)
        }
        else{
          window.location.href = environment.telegramCallbackUrl
        }
        
      },
      (err) => {
          this.toast.error("Incorrect username");
          
         
        }
      )
  }

  onUpdateUserName(event : Event){
    this.telegramUsername = (<HTMLInputElement>event.target).value;
  }

  updateShareTherapy(){
    this.telegramService.configuration({shareTherapy: this.shareTherapy}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });

  }
  updateShareAnalysis(){
    this.telegramService.configuration({shareAnalysis: this.shareAnalysis}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });

  }

  updateShareMedicalArea(){
    this.telegramService.configuration({shareMedicalArea: this.shareMedicalArea}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });

  }
  updateShareMedicalVisit(){
    this.telegramService.configuration({shareMedicalVisit: this.shareMedicalVisit}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });

  }
  updateShareDisease(){
    this.telegramService.configuration({shareDisease: this.shareDisease}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }
  updateShareHospitalization(){
    this.telegramService.configuration({shareHospitalization: this.shareHospitalization}).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      } else {
        this.toast.error('An error occurred');
      }
    });
  }

  deleteAccount() {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        infoText: 'Are you sure? All data related to your Instagram account will be deleted from ' + environment.appName
      }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.telegramService.deleteAccount().subscribe((res) => {
          if (res.auth) {
            this.user.identities.telegram = null;
          } else {
            this.toast.error('Something went wrong.');
          }
        });
      }
    });
  }

  updateProfile(){
    window.location.href = environment.telegramCallbackUrl
  }


  updateDiagnoses(showToast?: boolean, diagnosesnumber?: Number )  {
    if (this.shareDiagnosis == true){

    
    this.loadingDiagnoses = true;
    this.telegramService.userDiagnoses(diagnosesnumber).subscribe(
      (res) => {
        this.loadingDiagnoses = false;
        if (res) {
          if (showToast) {
            this.toast.success('diagnosis Updated');
          }
          if (res.diagnosis && res.diagnosis.length > 0) {
            this.diagnoses = res.diagnosis;

          } 
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingDiagnoses = false;
      });
    } else {
      if (showToast){
      this.toast.error("Diagnoses update not allowed")
      } else {

        this.telegramService.userDiagnoses(diagnosesnumber).subscribe(
          (res) => {
            this.loadingDiagnoses = false;
            if (res) {
              if (res.diagnosis && res.diagnosis.length > 0) {
                this.diagnoses = res.diagnosis;
    
              } 
            }
          },
          (err) => {
            this.loadingDiagnoses = false;
          });

      }
    }
  }

  updateAnalyses(showToast?: boolean, analysesnumber?: Number )  {
    if (this.shareAnalysis == true){

    
    this.loadingAnalyses = true;
    this.telegramService.userAnalyses(analysesnumber).subscribe(
      (res) => {
        this.loadingAnalyses = false;
        if (res) {
          if (showToast) {
            this.toast.success('Analysis Updated');
          }
          if (res.analysis && res.analysis.length > 0) {
            this.analyses = res.analysis;

          } 
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingAnalyses = false;
      });
    } else {
      if (showToast){
      this.toast.error("Analyses update not allowed")
      } else {

        this.telegramService.userAnalyses(analysesnumber).subscribe(
          (res) => {
            this.loadingAnalyses = false;
            if (res) {
              if (res.analysis && res.analysis.length > 0) {
                this.analyses = res.analysis;
    
              } 
            }
          },
          (err) => {
            this.loadingAnalyses = false;
          });

      }
    }
  }

  updateTherapies(showToast?: boolean, therapiesnumber?: Number )  {
    if (this.shareTherapy == true){

    
    this.loadingTherapies= true;
    this.telegramService.userTherapy(therapiesnumber).subscribe(
      (res) => {
        this.loadingTherapies = false;
        if (res) {
          if (showToast) {
            this.toast.success('Therapy Updated');
          }
          if (res.therapy && res.therapy.length > 0) {
            this.therapies = res.therapy;

          } 
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingTherapies = false;
      });
    } else {
      if (showToast){
      this.toast.error("therapy update not allowed")
      } else {

        this.telegramService.userTherapy(therapiesnumber).subscribe(
          (res) => {
            this.loadingTherapies = false;
            if (res) {
              if (res.therapy && res.therapy.length > 0) {
                this.therapies = res.therapy;
    
              } 
            }
          },
          (err) => {
            this.loadingTherapies = false;
          });

      }
    }
  }

  updateMedicalArea(showToast?: boolean, medicalAreanumber?: Number )  {
    if (this.shareMedicalArea == true){

    
    this.loadingMedicalArea= true;
    this.telegramService.userMedicalArea(medicalAreanumber).subscribe(
      (res) => {
        this.loadingMedicalArea = false;
        if (res) {
          if (showToast) {
            this.toast.success('Medical Area Updated');
          }
          if (res.medicalArea && res.medicalArea.length > 0) {
            this.medicalArea = res.medicalArea;

          } 
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingMedicalArea = false;
      });
    } else {
      if (showToast){
      this.toast.error("Medical Area update not allowed")
      } else {

        this.telegramService.userMedicalArea(medicalAreanumber).subscribe(
          (res) => {
            this.loadingMedicalArea = false;
            if (res) {
              if (res.medicalArea && res.medicalArea.length > 0) {
                this.medicalArea = res.medicalArea;
    
              } 
            }
          },
          (err) => {
            this.loadingMedicalArea = false;
          });

      }
    }
  }


  updateMedicalVisit(showToast?: boolean, medicalVisitnumber?: Number )  {
    if (this.shareMedicalVisit == true){

    
    this.loadingMedicalVisit= true;
    this.telegramService.userMedicalVisit(medicalVisitnumber).subscribe(
      (res) => {
        this.loadingMedicalVisit = false;
        if (res) {
          if (showToast) {
            this.toast.success('Medical Visit Updated');
          }
          if (res.medicalVisit && res.medicalVisit.length > 0) {
            this.medicalVisit = res.medicalVisit;

          } 
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingMedicalVisit = false;
      });
    } else {
      if (showToast){
      this.toast.error("Medical Visit update not allowed")
      } else {

        this.telegramService.userMedicalVisit(medicalVisitnumber).subscribe(
          (res) => {
            this.loadingMedicalVisit = false;
            if (res) {
              if (res.medicalVisit && res.medicalVisit.length > 0) {
                this.medicalVisit = res.medicalVisit;
    
              } 
            }
          },
          (err) => {
            this.loadingMedicalVisit = false;
          });

      }
    }
  }


  updateDisease(showToast?: boolean, diseasenumber?: Number )  {
    if (this.shareDisease == true){

    
    this.loadingDisease= true;
    this.telegramService.userDisease(diseasenumber).subscribe(
      (res) => {
        this.loadingDisease = false;
        if (res) {
          if (showToast) {
            this.toast.success('Disease Updated');
          }
          if (res.disease && res.disease.length > 0) {
            this.disease = res.disease;

          } 
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingDisease = false;
      });
    } else {
      if (showToast){
      this.toast.error("Disease update not allowed")
      } else {

        this.telegramService.userDisease(diseasenumber).subscribe(
          (res) => {
            this.loadingDisease = false;
            if (res) {
              if (res.disease && res.disease.length > 0) {
                this.disease = res.disease;
    
              } 
            }
          },
          (err) => {
            this.loadingDisease = false;
          });

      }
    }
  }


  updateHospitalization(showToast?: boolean, hospitalizationnumber?: Number )  {
    if (this.shareHospitalization == true){

    
    this.loadingHospitalization= true;
    this.telegramService.userHospitalization(hospitalizationnumber).subscribe(
      (res) => {
        this.loadingHospitalization = false;
        if (res) {
          if (showToast) {
            this.toast.success('Hospitalization Updated');
          }
          if (res.hospitalization && res.hospitalization.length > 0) {
            this.hospitalization = res.hospitalization;

          } 
        } else {
          if (showToast) {
            this.toast.warning('Timeout not elapsed. Retry in about five minutes');
          }
        }
      },
      (err) => {
        this.loadingHospitalization = false;
      });
    } else {
      if (showToast){
      this.toast.error("Hospitalization update not allowed")
      } else {

        this.telegramService.userHospitalization(hospitalizationnumber).subscribe(
          (res) => {
            this.loadingHospitalization = false;
            if (res) {
              if (res.hospitalization && res.hospitalization.length > 0) {
                this.hospitalization = res.hospitalization;
    
              } 
            }
          },
          (err) => {
            this.loadingHospitalization = false;
          });

      }
    }
  }

  private setupTelegramProfileTable() {

    // user telegram data
    const telegram = this.user.identities.telegram;

    // array used to populate the data source object
    const telegramProfile: {dataName: string, dataValue: any}[] = [];

    if (telegram['telegramId'] && telegram['telegramId'] !== '') {
      telegramProfile.push({dataName: 'Telegram chat Id', dataValue: telegram['telegramId']});

    }

    if (telegram['firstname'] && telegram['firstname'] !== '') {
      telegramProfile.push({dataName: 'Firstname', dataValue: telegram['firstname']});
    }

    if (telegram['lastname'] && telegram['lastname'] !== '') {
      telegramProfile.push({dataName: 'lastname', dataValue: telegram['lastname']});
    }

    if (telegram['username'] && telegram['username'] !== '') {
      telegramProfile.push({dataName: 'Username', dataValue: telegram['username']});
    }
    
    if (telegram['sex'] && telegram['sex'] !== '') {
      telegramProfile.push({dataName: 'sex', dataValue: telegram['sex']});
    }

    if (telegram['birth'] && telegram['birth'] !== '') {
      telegramProfile.push({dataName: 'birth', dataValue: telegram['birth']});
    }

    if (telegram['birthCity'] && telegram['birthCity'] !== '') {
      telegramProfile.push({dataName: 'birth city', dataValue: telegram['birthCity']});
    }

    if (telegram['province'] && telegram['province'] !== '') {
      telegramProfile.push({dataName: 'province', dataValue: telegram['province']});
    }

    if (telegram['fiscalCode'] && telegram['fiscalCode'] !== '') {
      telegramProfile.push({dataName: 'fiscal Code', dataValue: telegram['fiscalCode']});
    }

    this.dataSource = new MatTableDataSource(telegramProfile);
  }

}
