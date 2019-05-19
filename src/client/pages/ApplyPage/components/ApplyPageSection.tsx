import { TESCEvent } from '@Shared/ModelTypes';
import React from 'react';
import { InjectedFormProps } from 'redux-form';

export interface ApplyPageSectionProps {

  //The event this application is for
  event: TESCEvent;

  //function to be called when the back button is pressed
  goToPreviousPage?: () => void;
}

/**
 * This is an abstraction that creates a React component with the props for
 * the current event being applied to and a function that makes the ApplyPage
 * move the page. Each section of the application simply extends this class.
 */
export default class ApplyPageSection<FormData, P extends ApplyPageSectionProps, S = {}>
  extends React.Component<P & InjectedFormProps<FormData, P>, S> {

}
