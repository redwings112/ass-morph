import { db } from './firebaseConfig';  // Ensure db is initialized
import { query, where, getDocs, QuerySnapshot, DocumentData, WhereFilterOp, collection } from 'firebase/firestore';

/**
 * Query documents from a Firestore collection.
 * @param collectionName The name of the collection to query.
 * @param field The field to query against.
 * @param operator The comparison operator for the query (e.g., '==', '>', '<', etc.).
 * @param value The value to compare the field to.
 * @returns A promise that resolves with the QuerySnapshot containing the documents.
 */
export const queryDocuments = async (
  collectionName: string,
  field: string,
  operator: WhereFilterOp,
  value: any
): Promise<QuerySnapshot<DocumentData>> => {
  try {
    // Firestore query
    const q = query(collection(db, collectionName), where(field, operator, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  } catch (error: any) {
    // Error handling
    throw new Error(error.message || 'Error querying Firestore documents');
  }
};
