import { Injectable } from '@angular/core';

@Injectable()
export class PageLevelService {

  cigarDetailsSubPagesOnInit() {
    let detailContainers = document.querySelectorAll('.cigar-details-container');
    for (let i = 0; i < detailContainers.length; i++) {
      let container:any = detailContainers[i];
      container.style.display = null;
      container.classList.add('hide-on-levels');
    }

    let actionButtons = document.querySelectorAll('.action-buttons');
    for (let j = 0; j < actionButtons.length; j++) {
      let button:any = actionButtons[j];
      button.classList.add('hide-on-levels');
    }
  }

  cigarDetailsSubPagesOnDestroy() {
    let hideClasses = document.querySelectorAll('.hide-on-levels');
    for (let i = 0; i < hideClasses.length; i++) {
      let hideClass:any = hideClasses[i];
      hideClass.classList.remove('hide-on-levels');
    }
  }

  userProfilePagesOnInit() {
    let userPageHolder = <HTMLElement>document.querySelector('.user-page-holder');
    userPageHolder.style.position = 'absolute';
    userPageHolder.style.display = 'block';
  }

  userProfilePagesOnDestroy() {
    let userPageHolder = <HTMLElement>document.querySelector('.user-page-holder');
    userPageHolder.style.position = null;
    userPageHolder.style.display = null;
  }
}
