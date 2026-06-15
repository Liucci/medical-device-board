from invites.create_invite_code import (
    create_invite_code
)

def create_invite_code_transaction(
                                    invite,
                                    hospital_id: str,
                                    created_by: str
                                  ):

    return create_invite_code(
                                email=invite.email,
                                role=invite.role,
                                hospital_id=hospital_id,
                                created_by=created_by
                              )