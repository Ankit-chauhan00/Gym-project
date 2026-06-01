"use client";

import MembershipForms from "@/components/forms/MembershipForms";
import { createMembership } from "@/lib/actions/admin.action";
import { CreateMembershipSchema } from "@/lib/validation";

const MembershipPlans = () => {
  return (
    <>
      <MembershipForms
        schema={CreateMembershipSchema}
        defaultValues={{
          membershipName: "",
          description: "",
          membershipPrice: 1,
          membershipDuration: 0,
          isActive: true,
        }}
        onSubmit={createMembership}
      />
    </>
  );
};
export default MembershipPlans;
