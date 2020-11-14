import {Component, OnInit} from '@angular/core';
import {APP_ROUTES} from '../../../app-routes';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {ProfileService} from '../../../services/profile.service';
import {StatsService} from '../../../services/stats.service';
import {FacebookService} from '../../../services/facebook.service';
import {TwitterService} from '../../../services/twitter.service';
import {FitbitService} from '../../../services/fitbit.service';

@Component({
  styleUrls: ['./profile-data.component.scss'],
  templateUrl: './profile-data.component.html'
})
export class ProfileDataComponent implements OnInit {

  /**
   * Application routes used in the UI.
   */
  appRoutes = APP_ROUTES;

  /**
   * Router used in the UI.
   */
  routedPage: Router;

  /**
   * Root page.
   */
  rootPage: string;

  /**
   * Current logged user.
   */
  user: any;

  /**
   * Selected sub-page (demographics, interest, etc).
   */
  selected = '';

  /**
   * Bio fields used in the UI to make the user bio.
   */
  bioFields: {
    name?: string,
    gender?: string,
    location?: string,
    language?: string,
    email?: {
      number: number,
      value: string,
    },
    industry?: string,
    dateOfBirth?: string,
    height?: string,
    weight?: string,
    country?: string,
    interests?: string,
    sentiment?: string,
    emotion?: string,
    personality?: string,
    empathy?: string,
    socialRelations?: string,
    activity?: string,
    physicalActivity?: string,
    sleep?: string,
    heart?: string,
    food?: string,

    // TODO add here more fields
  } = { };

  /**
   * Fitbit user sleeps detected by sensors.
   */
  sleeps: any;

  /**
   * Fitbit user heart rate detected by sensors.
   */
  hearts: any;

  /**
   * Fitbit user weight.
   */
  weights: any;

  /**
   * Fitbit user weight.
   */
  activities: any;

  /**
   * Fitbit user weight.
   */
  physicalActivities: any;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private profileService: ProfileService,
    private statsService: StatsService,
    private facebookService: FacebookService,
    private twitterService: TwitterService,
    private fitbitService: FitbitService,
  ) { }

  /**
   * @override
   */
  ngOnInit() {

    if (this.profileService.getCachedProfile()) {
      this.user = this.profileService.getCachedProfile();
    } else {
      this.user = this.authService.getCachedUser();
    }
    this.rootPage = `/${APP_ROUTES.profile.root}/${this.user.username}/${APP_ROUTES.profile.data}`;
    this.routedPage = this.router;

    // reading sub-page id
    this.route.queryParams.subscribe(params => {
      const dataId = params['show'];

      if (dataId) {
        if (dataId !== APP_ROUTES.profile.demographics
          && dataId !== APP_ROUTES.profile.interest
          && dataId !== APP_ROUTES.profile.affects
          && dataId !== APP_ROUTES.profile.cognitiveAspects
          && dataId !== APP_ROUTES.profile.behavior
          && dataId !== APP_ROUTES.profile.socialRelations
          && dataId !== APP_ROUTES.profile.physicalState) {

          this.router.navigateByUrl(this.rootPage);

        } else {
          this.selected = dataId;
        }
      }
    });

    this.buildBioFields();
  }

  /**
   * Make the bio from user data. The sort functions is useful to show only updated data.
   */
  private buildBioFields(): void {
    const demographics = this.user.demographics;
    if (demographics) {

      // catch the name
      if (demographics.name) {
        this.bioFields.name = demographics.name.value;
      }

      // catch location
      if (demographics.location && demographics.location.length > 0) {
        this.bioFields.location = demographics.location.sort((a, b) => b.timestamp - a.timestamp)[0].value;
      }

      // catch gender
      if (demographics.gender) {
        this.bioFields.gender = demographics.gender.value;
      }

      // catch emails
      if (demographics.email) {
        let emails = '';
        const emailSortedArray = demographics.email.sort((a, b) => b.timestamp - a.timestamp);
        this.bioFields.email = {
          number: 0,
          value: '',
        };
        for (const email of emailSortedArray) {

          // only the last emails with the same timestamp
          if (email.timestamp === emailSortedArray[0].timestamp) {
            emails += email.value + ', ';
            this.bioFields.email.number++;
          }
        }

        // remove last comma
        if (emails.substr(emails.length - 2) === ', ') {
          emails = emails.substr(0, emails.length - 2);
        }
        this.bioFields.email.value = emails;
      }

      // catch gender
      if (demographics.gender) {
        this.bioFields.gender = demographics.gender.value;
      }

      // catch languages
      if (demographics.language) {
        let languages = '';
        const languageSortedArray = demographics.language.sort((a, b) => b.timestamp - a.timestamp);

        for (const language of languageSortedArray) {

          // only the last languages with the same timestamp and different value
          if (language.timestamp === languageSortedArray[0].timestamp) {
            switch (language.value) {
              case 'it':
                language.value = 'italian';
                break;
              case 'en':
                language.value = 'english';
                break;
              case 'es':
                language.value = 'spanish';
                break;
              case 'fr':
                language.value = 'french';
                break;
              case 'de':
                language.value = 'german';
              break;
            }
            languages += language.value + ', ';
          }
        }

        // remove last comma
        if (languages.substr(languages.length - 2) === ', ') {
          languages = languages.substr(0, languages.length - 2);
        }
        this.bioFields.language = languages;
      }

      // catch date of birth
      if (demographics.dateOfBirth) {
        this.bioFields.dateOfBirth = demographics.dateOfBirth.value;
      }

      // catch industry
      if (demographics.industry && demographics.industry.length > 0) {
        this.bioFields.industry = demographics.industry.sort((a, b) => b.timestamp - a.timestamp)[0].value;
      }

      // catch interests
      this.statsService.getInterestsStats({source: 'message_tag', limit: 3}).then(
        (res) => {
          if (res && res.length) {
            this.bioFields.interests = res[0].value + ', ' + res[1].value + ' and ' + res[2].value;
          }
        }
      );

      // catch mood (sentiment)
      this.statsService.getSentimentTimelineStats().then(
        (res) => {
            if (res && res.length) {
              const lastData = {date: '0', name: null};

              res.forEach((data) => {
                const tempMessage = data.values[data.values.length - 1];
                if (tempMessage.date > lastData.date) {
                  lastData.name = data.name;
                  lastData.date = tempMessage.date;
                }
              });

              if (lastData.name === 'No sentiment') {
                lastData.name = 'neuter';
              }

              this.bioFields.sentiment = lastData.name;
            }
          }
      );

      // catch emotion
      this.statsService.getEmotionTimelineStats().then(
        (res) => {
          if (res && res.length) {
            const lastData = {date: '0', name: null};

            res.forEach((data) => {
              const tempMessage = data.values[data.values.length - 1];
              if (tempMessage.date > lastData.date) {
                lastData.name = data.name;
                lastData.date = tempMessage.date;
              }
            });

            if (lastData.name) {

              if (lastData.name.replace(/\s/g, '') === 'disgust') {
                lastData.name = 'disgusted';
              } else if (lastData.name.replace(/\s/g, '') === 'anger') {
                lastData.name = 'angry';
              } else if (lastData.name.replace(/\s/g, '') === 'joy') {
                lastData.name = 'joyful';
              } else if (lastData.name.replace(/\s/g, '') === 'fear') {
                lastData.name = 'afraid';
              } else if (lastData.name.replace(/\s/g, '') === 'surprise') {
                lastData.name = 'surprised';
              }

              this.bioFields.emotion = lastData.name;
            }

          }
        }
      );

      // catch personality
      if (this.user.personalities && this.user.personalities.length) {
        this.bioFields.personality = '';
        let last = this.user.personalities.sort((a, b) => b.timestamp - a.timestamp)[0];

        // clone the object
        last = JSON.parse(JSON.stringify(last));

        // remove metadata
        last.source = undefined;
        last.confidence = undefined;
        last.timestamp = undefined;

        let i = 0;
        while (i < 2) {
          let maxValue = -1;
          let maxKey = '';
          for (const key in last) {
            if (last.hasOwnProperty(key)) {
              if (last[key] > maxValue) {
                maxValue = last[key];
                maxKey = key;
              }
            }
          }
          last[maxKey] = undefined;

          if (i == 0) {
            this.bioFields.personality += 'your ' + maxKey + ' and ';
          } else {
            this.bioFields.personality += 'your ' + maxKey;
          }

          i++;
        }
      }

      // catch empathy
      if (this.user.empathies && this.user.empathies.length) {
        const empathyValue = this.user.empathies.sort((a, b) => b.timestamp - a.timestamp)[0].value;
        this.bioFields.empathy = 'medium';
        if (empathyValue <= 0.3) {
          this.bioFields.empathy = 'low';
        } else if (empathyValue > 0.7) {
          this.bioFields.empathy = 'high';
        }
      }

      // catch social relations
      this.getFacebookFriends(1000, []).then(
        (res) => {
          this.getTwitterFriends(1000, res).then(
            (res2) => {
              this.getAndroidContacts(1000, res2).then(
                (res3) => {
                  if (res3 && res3.length > 2) {
                    this.bioFields.socialRelations = res3.length + ' social relations. ' +
                      'The persons you interact with the most are ' + res3[0].name + ' and ' + res3[1].name;
                  }
                }
              );
            }
          );
        }
      );


      /**Bio phrases related to sleep*/
      // catch sleep
      let sumHourSleep = 0;
      this.bioFields.sleep = '';
      this.fitbitService.userSleepDate(1000, new Date((new Date()).setDate((new Date()).getDate() - 7)) , new Date()).subscribe(
        (res) => {

          if (res.sleeps && res.sleeps.length) {
            this.sleeps = res.sleeps;
            this.sleeps.forEach(function (arrayItem) {
              sumHourSleep = ((arrayItem.duration / (1000 * 60 * 60)) % 24) + sumHourSleep;
            });
            /** verifico se in media si è riposato 6 ore al giorno(nell'arco di una settimana)*/
            if (sumHourSleep > 42) {
              this.bioFields.sleep =  'You slept enough this week.';

            } else if (sumHourSleep == 0) {
              this.bioFields.sleep =  '';
            } else {
              this.bioFields.sleep =  'You did not sleep enough this week.';
            }
          }
        }
      );

      /**Bio phrases related to activity steps*/
        // catch activity
      this.bioFields.activity = '';

      const filters = {
        dateFrom: new Date((new Date()).setDate((new Date()).getDate() - 7)),
        dateTo: new Date(),
        limitResult: 1000,
      };

      this.statsService.getActivityDataFitbit(filters).then(
        (res) => {
          if (res && res.length) {

              res.sort(function(a, b){
                return a.timestamp - b.timestamp;
              });

            let sumSteps = 0;
            this.activities = res;
            this.activities.forEach(function (arrayItem) {
              if (arrayItem.steps > 0) {

                sumSteps = arrayItem.steps + sumSteps;
              }
            });
            /** verifico se in media sono stati effettuati più di 8000 passi giornalieri nell'ultima settimana  */
            if (sumSteps > 42000) {
              this.bioFields.activity =  'You walked a lot this week.';

            } else if (sumSteps > 28000 && sumSteps < 42000) {
              this.bioFields.activity =  'You walked enough this week.';

            } else if (sumSteps < 28000) {
              this.bioFields.activity =  'You have been rather sedentary this week.';
            }
          }
        }
      );


      /**Bio phrases related to physical activity*/
      // catch activity
      this.bioFields.physicalActivity = '';

      this.statsService.getActivityDataFitbit(filters).then(
        (res) => {
          if (res && res.length) {

            res.sort(function(a, b){
              return a.timestamp - b.timestamp;
            });

            let sumMinutesVeryActive = 0;
            this.physicalActivities = res;
            this.physicalActivities.forEach(function (arrayItem) {
              if (arrayItem.minutesVeryActive > 0) {
                sumMinutesVeryActive = arrayItem.minutesVeryActive + sumMinutesVeryActive;
              }
            });
            /**  verifico se è stata effettuata attività fisica giornaliera  */
            if (sumMinutesVeryActive > 300) {
              this.bioFields.physicalActivity =  'You practiced much physical activity this week.';

            } else if (sumMinutesVeryActive > 100 && sumMinutesVeryActive < 300) {
              this.bioFields.physicalActivity =  'You practiced enough physical activity this week.';

            } else {
              this.bioFields.physicalActivity =  'You have not practiced enough physical activity this week.';
            }
          }
        }
      );


      /**Bio phrases related to heart*/
        // catch heart
      let sumRestingHeartRate = 0;
      this.bioFields.heart = '';
      this.fitbitService.userHeartDate(1000, new Date((new Date()).setDate((new Date()).getDate() - 7)), new Date()).subscribe(
        (res) => {
          if (res.hearts && res.hearts.length) {
            this.hearts = res.hearts;
            this.hearts.forEach(function (arrayItem) {
              sumRestingHeartRate = arrayItem.restingHeartRate + sumRestingHeartRate;
            });
            /** verifico se il battito cardiaco è stato regolare (al di sotto dei 100 battiti al minuto) nell'arco di una settimana*/
            if (sumRestingHeartRate > 600) {
              this.bioFields.heart =  'The heartbeat was regular.';

            } else {
              this.bioFields.heart =  'On average, you had an high number of heartbeats.';
            }

          }
        }
      );

      /**Bio phrases related to weight*/
        // catch heart
      let firstWeight = 0, lastWeight = 0, flag = 0;
      this.bioFields.weight = '';
      this.fitbitService.userWeightDate(1000, new Date((new Date()).setDate((new Date()).getDate() - 7)) , new Date()).subscribe(
        (res) => {
          if (res.weights && res.weights.length) {
            this.weights = res.weights;
            this.weights.forEach(function (arrayItem) {
              if (flag == 1) {
                firstWeight = arrayItem.bodyWeight;
              }
              if (flag == 7) {
                lastWeight = arrayItem.bodyWeight;
              }
              flag++;
            });
            /** verifico l'andamento del peso corporeo nell'arco di una settimana*/
            if (firstWeight > lastWeight) {
                this.bioFields.weight =  'You lost weight this week.';

            } else if (firstWeight < lastWeight) {
                this.bioFields.weight =  'You got fat in this week.';

            } else {
                this.bioFields.weight =  'You did not lose weight this week.';
            }
          }
        }
      );
      // TODO add here new fields to collect

    }
  }


  /**
   * Get Facebook friends.
   * @param number: the friends number
   * @param data: input/output array
   */
  private getFacebookFriends(number: number, data?: any[]): Promise<any> {
    return new Promise((resolve, reject) =>
      this.facebookService.friends(number).subscribe(
      (res) => {
        if (res.friends && res.friends.length > 0) {
          res.friends.forEach((friend) => {
            data.push({name: friend.contactName, id: null, interactions: 1});
          });
          data.sort((a, b) => b.interactions - a.interactions);
        }
        return resolve(data);
      },
      (err) => {
        return resolve(data);
      }
    ));
  }

  /**
   * Get Twitter friends (followers and followings)
   * @param number: the friends number
   * @param data: input/output array
   */
  private getTwitterFriends(number: number, data?: any[]): Promise<any> {
    return new Promise((resolve, reject) =>
      this.twitterService.friends(number).subscribe(
      (res) => {
        if (res.friends && res.friends.length > 0) {
          res.friends.forEach((friend) => {
            const contact = data.find(x => x.id == friend.contactId);
            if (contact) {
              contact.interactions++;
            } else {
              data.push({name: friend.contactName, id: friend.contactId, interactions: 1});
            }
          });
          data.sort((a, b) => b.interactions - a.interactions);
        }
        return resolve(data);
      },
      (err) => {
        return resolve(data);
      }
    ));
  }

  /**
   * Get Android contacts.
   * @param number: the contacts number
   * @param data: input/output array
   */
  private getAndroidContacts(number: number, data?: any[]): Promise<any> {
    return new Promise((resolve, reject) =>
      this.statsService.getAndroidContactStats({limitResults: number}).then(
      (res) => {
        if (res.length) {
          res.forEach((contact) => {
            data.push({name: contact.name, id: null, interactions: contact.value});
          });
          data.sort((a, b) => b.interactions - a.interactions);
        }
        return resolve(data);
      },
      (err) => {
        return resolve(data);
      }
    ));
  }

}
