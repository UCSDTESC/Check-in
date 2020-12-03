import React, { FC } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { reduxForm, InjectedFormProps, Field, formValueSelector } from 'redux-form';
import FA from 'react-fontawesome';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { ApplicationState } from '~/reducers';
import { TESCTeam, TESCUser } from '@Shared/ModelTypes';

type FormData = Partial<TESCTeam>;
interface Props {
    open: boolean;
    members?: TESCUser[];
    newEmail?: string;
    toggle: () => void;
}

const EditTeamModal: FC<Props & InjectedFormProps<FormData, Props>> = props => {
    const validEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)

    return (
        <Modal
            isOpen={props.open}
            toggle={props.toggle}
            size="lg"
        >
            <form onSubmit={props.handleSubmit}>
                <ModalHeader toggle={props.toggle}>
                    Editing Team {(props.initialValues && props.initialValues.code) || ''}
                </ModalHeader>
                <ModalBody>
                    <div className="container sd-form">
                        <div className="row mt-2">
                            <div className="col-12">
                                <h2>Members</h2>
                                <ul>
                                    {props.members.map((member, i) => (
                                        <li
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                            key={i}
                                        >
                                            {member.lastName}, {member.firstName} ({member.account.email})
                                            <Button
                                                // @ts-ignore
                                                size="sm"
                                                onClick={() => props.array.remove('members', i)}
                                            >
                                                <FA name="minus" />
                                            </Button>
                                        </li>
                                    ))}

                                    {props.members.length < 4 && (
                                        <div className="list-group-item d-flex justify-content-between align-items-center">
                                            <label htmlFor="newEmail" className="sd-form__label">Add a Teammate</label>
                                            <Field
                                                name="newEmail"
                                                className="sd-form__input-text"
                                                type="email"
                                                placeholder="triton@ucsd.edu"
                                                component="input"
                                            />
                                            <Button
                                                // @ts-ignore
                                                size="sm"
                                                style={{ marginLeft: 20 }}
                                                onClick={() => {
                                                    props.array.push('members', { account: { email: props.newEmail } })
                                                    props.change('newEmail', '')
                                                }}
                                                disabled={!validEmail(props.newEmail) || props.members.some(user => props.newEmail === user.account.email)}
                                            >
                                                <FA name="plus" />
                                            </Button>
                                        </div>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button
                        type="submit"
                        className="rounded-button rounded-button--short rounded-button--small"
                        disabled={props.pristine || props.submitting || !!props.newEmail}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="rounded-button rounded-button--short rounded-button--small rounded-button--alert"
                        onClick={props.toggle}
                    >
                        Cancel
                    </button>
                </ModalFooter>
            </form>
        </Modal>
    )
}

const mapStateToProps = (state: ApplicationState, ownProps: Props) => {
    return {
        members: formValueSelector('newAdmin')(state, 'members') || [],
        newEmail: formValueSelector('newAdmin')(state, 'newEmail') || '',
    } as Partial<Props>;
};

export default compose(
    reduxForm<FormData, Props>({
        form: 'newAdmin',
        destroyOnUnmount: true,
        enableReinitialize: true,
    }),
    connect(mapStateToProps)
)(EditTeamModal);
