import {Component, Input} from '@angular/core';
import {FacebookService} from '../../../../services/facebook.service';
import {TwitterService} from '../../../../services/twitter.service';
import {InstagramService} from '../../../../services/instagram.service';
import {FitbitService} from '../../../../services/fitbit.service';
import {StatsService} from '../../../../services/stats.service';
import {MatTableDataSource} from '@angular/material';

const FRIENDS_NUMBER = 5000;

@Component({
  selector: 'app-profile-social-relations',
  styleUrls: ['./../profile-data.component.scss'],
  templateUrl: './profile-data-social-relations.component.html'
})
export class ProfileDataSocialRelationsComponent {

  /**
   * The user profile (logged or not).
   */
  @Input() user: any;

  /**
   * Friends data.
   */
  data: {name: string, id: string, interactions: number}[] = [];

  /**
   * Available contact types.
   */
  sources = [{
    id: null,
    name: 'All',
  }, {
    id: 'facebook',
    name: 'Facebook',
  }, {
    id: 'twitter',
    name: 'Twitter',
  }, {
    id: 'android',
    name: 'Phone Contact',
  }, {
    id: 'instagram',
    name: 'Instagram',
  }, {
    id: 'fitbit',
    name: 'Fitbit',
  },

    // TODO add here new source type
  ];

  /**
   * Selected source.
   */
  selectedSouce = this.sources[0].id;

  // data source containing user friends data
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['name', 'interactions'];


  constructor(
    private facebookService: FacebookService,
    private twitterService: TwitterService,
    private instagramService: InstagramService,
    private fitbitService: FitbitService,
    private statsService: StatsService,
  ) {}

  /**
   * Get friends by source.
   */
  getFriends() {
    switch (this.selectedSouce) {
      case 'facebook':
        this.data = [];
        this.getFacebookFriends(FRIENDS_NUMBER);
        break;
      case 'twitter':
        this.data = [];
        this.getTwitterFriends(FRIENDS_NUMBER);
        break;
      case 'instagram':
        this.data = [];
        this.getInstagramFriends(FRIENDS_NUMBER);
        break;
      case 'fitbit':
        this.data = [];
        this.getFitbitFriends(FRIENDS_NUMBER);
        break;
      case 'android':
        this.data = [];
        this.getAndroidContacts(FRIENDS_NUMBER);
        break;
      default:
        this.data = [];
        this.getFacebookFriends(FRIENDS_NUMBER);
        this.getTwitterFriends(FRIENDS_NUMBER);
        this.getInstagramFriends(FRIENDS_NUMBER);
        this.getFitbitFriends(FRIENDS_NUMBER);
        this.getAndroidContacts(FRIENDS_NUMBER);
        break;
    }
  }

  /**
   * Get Facebook friends.
   * @param number: the friends number
   */
  private getFacebookFriends(number: number) {
    this.facebookService.friends(number).subscribe(
      (res) => {
        if (res.friends && res.friends.length > 0) {
          res.friends.forEach((friend) => {
            this.data.push({name: friend.contactName, id: null, interactions: 1});
          });
          this.data.sort((a, b) => b.interactions - a.interactions);
          this.dataSource = new MatTableDataSource(this.data);
        }
      }
    );
  }

  /**
   * Get Twitter friends (followers and followings)
   * @param number: the friends number
   */
  private getTwitterFriends(number: number) {
    this.twitterService.friends(number).subscribe(
      (res) => {
        if (res.friends && res.friends.length > 0) {
          res.friends.forEach((friend) => {
            const contact = this.data.find(x => x.id == friend.contactId);
            if (contact) {
              contact.interactions++;
            } else {
              this.data.push({name: friend.contactName, id: friend.contactId, interactions: 1});
            }
          });
          this.data.sort((a, b) => b.interactions - a.interactions);
          this.dataSource = new MatTableDataSource(this.data);
        }
      }
    );
  }

  /**
   * Get Android contacts.
   * @param number: the contacts number
   */
  private getAndroidContacts(number: number) {
    this.statsService.getAndroidContactStats({limitResults: number}).then(
      (res) => {
        if (res.length) {
          res.forEach((contact) => {
            this.data.push({name: contact.name, id: null, interactions: contact.value});
          });
          this.data.sort((a, b) => b.interactions - a.interactions);
          this.dataSource = new MatTableDataSource(this.data);
        }
      }
    );
  }

  /**
   * Get Istagram friends (followers and followings)
   * @param number: the friends number
   */
  private getInstagramFriends(number: number) {
    this.instagramService.friends(number).subscribe(
      (res) => {
        console.log(res);
        if (res.friends && res.friends.length > 0) {
          res.friends.forEach((friend) => {
            const contact = this.data.find(x => x.id == friend.contactId);
            if (contact) {
              contact.interactions++;
            } else {
              this.data.push({name: friend.contactId, id: friend.contactName, interactions: 1});
            }
          });
          this.data.sort((a, b) => b.interactions - a.interactions);
          this.dataSource = new MatTableDataSource(this.data);
        }
      }
    );
  }


  /**
   * Get Fitbit friends.
   * @param number: the friends number
   */
  private getFitbitFriends(number: number) {
    this.fitbitService.userFriends(number).subscribe(
      (res) => {
        if (res.friends && res.friends.length > 0) {
          res.friends.forEach((friend) => {
            this.data.push({name: friend.contactName, id: null, interactions: 1});
          });
          this.data.sort((a, b) => b.interactions - a.interactions);
          this.dataSource = new MatTableDataSource(this.data);
        }
      }
    );
  }
}
