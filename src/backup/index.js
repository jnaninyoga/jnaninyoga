import jsonsessions from './sessions.json';
import { updateDocument } from '../firebase';
import { names } from '../firebase/collections';

export default function backup(day){
  const daySessions = jsonsessions.find(session => session.day === day).sessions;
  console.log("BACK UP:",daySessions);
  // update the firestore
  updateDocument(names.classes, day, { sessions: daySessions });
}
