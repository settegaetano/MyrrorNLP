import {Component} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {ProfileService} from '../../../services/profile.service';
import {Router} from '@angular/router';
import {APP_ROUTES} from '../../../app-routes';

@Component({
  styleUrls: ['./profile-settings.component.scss'],
  templateUrl: './profile-settings.component.html',
})
export class ProfileSettingsComponent {

  /**
   * Privacy options for 'holistic profile'.
   */
  privacyOptions = [
    {
      id: 'shareDemographics',
      name: 'Share Demographics',
      value: true,
    },
    {
      id: 'shareInterest',
      name: 'Share Interests',
      value: true,
    },
    {
      id: 'shareAffects',
      name: 'Share Affects',
      value: true,
    },
    {
      id: 'shareCognitiveAspects',
      name: 'Share Cognitive Aspects',
      value: true,
    },
    {
      id: 'shareBehavior',
      name: 'Share Behaviors',
      value: true,
    },
    {
      id: 'shareSocialRelations',
      name: 'Share Social Relations',
      value: true,
    },
    {
      id: 'sharePhysicalState',
      name: 'Share Physical States',
      value: true,
    }
  ];

  /**
   * Current logged user.
   */
  user: any;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private toast: ToastrService,
    private router: Router,
  ) {

    // hide this page to not logged user
    if (!profileService.isLoggedUser()) {

      // navigate to home page
      this.router.navigateByUrl(APP_ROUTES.home);
    } else {
      authService.getUser().then((user) => {
        this.user = user;
        this.privacyOptions.forEach((option) => {
          if (option.id === 'shareDemographics') {
            option.value = this.user.identities.configs.holisticProfileConfig.shareDemographics;
          } else if (option.id === 'shareInterest') {
            option.value = this.user.identities.configs.holisticProfileConfig.shareInterest;
          } else if (option.id === 'shareAffects') {
            option.value = this.user.identities.configs.holisticProfileConfig.shareAffects;
          } else if (option.id === 'shareCognitiveAspects') {
            option.value = this.user.identities.configs.holisticProfileConfig.shareCognitiveAspects;
          } else if (option.id === 'shareBehavior') {
            option.value = this.user.identities.configs.holisticProfileConfig.shareBehavior;
          } else if (option.id === 'shareSocialRelations') {
            option.value = this.user.identities.configs.holisticProfileConfig.shareSocialRelations;
          } else if (option.id === 'sharePhysicalState') {
            option.value = this.user.identities.configs.holisticProfileConfig.sharePhysicalState;
          }
        });
      });
    }
  }

  /**
   * Save configuration.
   */
  saveConfiguration() {
    const oldConfig = this.user.identities.configs.holisticProfileConfig;
    const newConfig: {
      shareDemographics?: boolean,
      shareInterest?: boolean,
      shareAffects?: boolean,
      shareCognitiveAspects?: boolean,
      shareBehavior?: boolean,
      shareSocialRelations?: boolean,
      sharePhysicalState?: boolean
    } = {};

    this.privacyOptions.forEach((option) => {
      if (option.id === 'shareDemographics') {
        if (oldConfig.shareDemographics !== option.value) {
          newConfig.shareDemographics = option.value;
        }
      } else if (option.id === 'shareInterest') {
        if (oldConfig.shareInterest !== option.value) {
          newConfig.shareInterest = option.value;
        }
      } else if (option.id === 'shareAffects') {
        if (oldConfig.shareAffects !== option.value) {
          newConfig.shareAffects = option.value;
        }
      } else if (option.id === 'shareCognitiveAspects') {
        if (oldConfig.shareCognitiveAspects !== option.value) {
          newConfig.shareCognitiveAspects = option.value;
        }
      } else if (option.id === 'shareBehavior') {
        if (oldConfig.shareBehavior !== option.value) {
          newConfig.shareBehavior = option.value;
        }
      } else if (option.id === 'shareSocialRelations') {
        if (oldConfig.shareSocialRelations !== option.value) {
          newConfig.shareSocialRelations = option.value;
        }
      } else if (option.id === 'sharePhysicalState') {
        if (oldConfig.sharePhysicalState !== option.value) {
          newConfig.sharePhysicalState = option.value;
        }
      }
    });

    this.authService.holisticProfileConfiguration(newConfig).subscribe((res) => {
      if (res && res.auth) {
        this.toast.success('Configuration updated');
      }
    });
  }

}
