"use client";
import TrainerForm from '@/components/forms/TrainerForm'
import { CreateTrainer } from '@/lib/actions/admin.action'
import { TrainerSchema } from '@/lib/validation';

import React from 'react'

const AddTrainer = () => {
  return (
    <>
    <TrainerForm
    schema={TrainerSchema}
    defaultValues={{email:"", username:"", password:"", specialization:"",phone:"",experience:""}}
    onSubmit={CreateTrainer}
    />
    </>
  )
}

export default AddTrainer