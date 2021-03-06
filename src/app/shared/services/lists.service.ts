import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { List } from '../model/list';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  constructor(private firestore: AngularFirestore) {
  }

  getLists(userId: string): any {
    return this.firestore.doc(this.getUserUrl(userId)).collection('lists').snapshotChanges().pipe(map(lists => {
      return lists.map(list => {
        return {
          id: list.payload.doc.id,
          ...list.payload.doc.data()
        } as List;
      });
    }));
  }

  createList(userId: string, list: List): any {
    delete list.id;
    return this.firestore.doc(this.getUserUrl(userId)).collection('lists').add(list);
  }

  updateList(userId: string, list: List): any {
    const listId = list.id;
    delete list.id;
    return this.firestore.doc(this.getListUrl(userId, listId)).update(list);
  }

  deleteList(userId: string, listId: string): any {
    return this.firestore.doc(this.getListUrl(userId, listId)).delete();
  }

  private getUserUrl(userId: string) {
    return `users/${userId}`;
  }

  private getListUrl(userId: string, listId: string) {
    return `users/${userId}/lists/${listId}`;
  }

}
