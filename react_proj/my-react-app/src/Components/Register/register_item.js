import React, { useState } from "react";
import { useForm, ErrorMessage } from "react-hook-form"
import { useHistory } from "react-router-dom"
import { useStateMachine, createStore } from "little-state-machine"
import updateAction from "./updateAction"

const register_item = props => {
    const { state, action } = useStateMachine(updateAction)
    const { handleSubmit, register, errors, watch } = useForm({
        defaultValues: state.yourDetails
    })
    const { push } = useHistory();
    const onSubmit = data => {
        action(data)
        push("/register3")
    }

    return (
        <div className = "form-div">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-box">
            <label>What is your favorite color?</label>
            <br />
            <select
                name="colors"
                ref={register}
                defaultValue = {state.yourDetails.colors}

            >
                <option value="">Select a color</option>
                <option value="Red">Red</option>
                <option value="Orange">Orange</option>
                <option value="Yellow">Yellow</option>
                <option value="Green">Green</option>
                <option value="Blue">Blue</option>
                <option value="Purple">Purple</option>
            </select>
            <br />

            <br />
            <label>Whats your favorite type of food? <br />
                <input
                    name='food'
                    placeholder = 'American, Italian, etc...'
                    ref={register}
                    defaultValue = {state.yourDetails.food}
                /></label>
            <br />

            <br />
            <label>Whats your favorite meal? <br />
                <input
                    name='meal'
                    placeholder = "In N' Out..."
                    ref={register}
                    defaultValue = {state.yourDetails.meal}

                /></label>
            <br />
            <button className = 'form-button'>Next!</button>
            <br/>
            <a className = 'skip' href = '/register3'>Skip</a>

        </div>
        </form>
        </div>
    )
}



export default register_item;