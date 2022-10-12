import { gql } from '@apollo/client';

export const GET_ACTIVITIES = gql`
  query GetActivities {
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
`
