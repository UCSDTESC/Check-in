import { TESCEvent } from '@Shared/Types';
import React from 'react';
import { InjectedFormProps } from 'redux-form';

export interface ApplyPageSectionProps {
  event: TESCEvent;
  goToPreviousPage?: () => void;
}

export default class ApplyPageSection<FormData, P extends ApplyPageSectionProps, S = {}>
  extends React.Component<P & InjectedFormProps<FormData, P>, S> {

}
