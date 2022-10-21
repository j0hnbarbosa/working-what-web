import { gql } from "@apollo/client";

export const GET_ACTIVITIES = gql`
  query getActivities {
    activities {
      id
      initialHour
      endHour
      spentTime
      description
      dateWork
      status
    }
  }
`;

export const CREATE_ACTIVITY = gql`
  mutation createActivity($attributes: ActivityAttributes) {
    createActivity(attributes: $attributes) {
      activity {
        id
        initialHour
        endHour
        spentTime
        description
        dateWork
        status
      }
    }
  }
`;

export const UPDATE_ACTIVITY = gql`
  mutation updateActivity($attributes: ActivityAttributes) {
    updateActivity(attributes: $attributes) {
      activity {
        id
        initialHour
        endHour
        spentTime
        description
        dateWork
        status
      }
    }
  }
`;
