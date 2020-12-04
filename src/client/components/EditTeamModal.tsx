import React, { FC, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { reduxForm, InjectedFormProps, Field, formValueSelector } from 'redux-form';
import FA from 'react-fontawesome';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { ApplicationState } from '~/reducers';
import { MAX_TEAM_SIZE, TESCTeam, TESCUser } from '@Shared/ModelTypes';
import classnames from 'classnames';

type FormData = Partial<TESCTeam>;
interface Props {
    open: boolean;
    members?: TESCUser[];
    form: string;
    errorMessage: string;
    toggle: () => void;
}

const EditTeamModal: FC<Props & InjectedFormProps<FormData, Props>> = props => {
    const [newMembers, setNewMembers] = useState([]);
    const [newEmail, setNewEmail] = useState("");

    const validEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)

    const { errorMessage } = props;

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
                                    {props.members.map((member, i) => {
                                        const newMember = newMembers.includes(member.account.email);
                                        return (
                                            <li
                                                className={classnames("list-group-item d-flex justify-content-between align-items-center", {
                                                    "list-group-item-success": newMember
                                                })}
                                                key={i}
                                            >
                                                {!newMember && <>{member.lastName}, {member.firstName} ({member.account.email})</>}
                                                {newMember && <>{member.account.email}</>}
                                                <Button
                                                    // @ts-ignore
                                                    size="sm"
                                                    onClick={() => props.array.remove('members', i)}
                                                >
                                                    <FA name="minus" />
                                                </Button>
                                            </li>
                                        )
                                        })}

                                    {props.members.length < MAX_TEAM_SIZE && (
                                        <div className="list-group-item d-flex justify-content-between align-items-center">
                                            <label htmlFor="newEmail" className="sd-form__label">Add a Teammate</label>
                                            <input
                                                name="newEmail"
                                                className="sd-form__input-text"
                                                type="email"
                                                placeholder="triton@ucsd.edu"
                                                value={newEmail}
                                                onChange={event => setNewEmail(event.target.value)}
                                            />
                                            <Button
                                                // @ts-ignore
                                                size="sm"
                                                style={{ marginLeft: 20 }}
                                                onClick={() => {
                                                    props.array.push('members', { account: { email: newEmail } });
                                                    setNewMembers([...newMembers, newEmail]);
                                                    setNewEmail("");
                                                }}
                                                disabled={!validEmail(newEmail) || props.members.some(user => newEmail === user.account.email)}
                                            >
                                                <FA name="plus" />
                                            </Button>
                                        </div>
                                    )}
                                </ul>
                            </div>
                        </div>
                        {!!errorMessage && <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button
                        type="submit"
                        className="rounded-button rounded-button--short rounded-button--small"
                        disabled={props.pristine || props.submitting || !!newEmail}
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
    console.log(ownProps.form);
    return {
        members: formValueSelector(ownProps.form)(state, 'members') || [],
        form: ownProps.form,
    } as Partial<Props>;
};

export default connect(mapStateToProps)((
    reduxForm<FormData, Props>({
        destroyOnUnmount: true,
        enableReinitialize: true,
    })
)(EditTeamModal));
