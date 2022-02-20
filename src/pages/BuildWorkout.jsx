import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { WorkoutTypes } from '../cmps/BuildWorkout/WorkoutTypes';
import { CurrWorkoutBuild } from '../cmps/BuildWorkout/CurrWorkoutBuild';
import { BuildWorkoutType } from '../cmps/BuildWorkout/BuildWorkoutType';
import { ModalWorkoutName } from "../cmps/ModalWorkoutName";
import { ModalSetRep } from "../cmps/ModalSetRep";
import { DragDropContext } from "react-beautiful-dnd";
import { ExerciseDetails } from '../cmps/BuildWorkout/ExerciseDetails'
import { onUpdate } from "../store/user.actions";
import { loadExercises } from '../store/exercise.actions'

function _BuildWorkout(props) {
    const { user, history, location } = props
    const { workoutToEdit } = location
    const [currWorkout, setCurrWorkout] = useState(workoutToEdit ? workoutToEdit : []);
    const [showExercise, setShowExercise] = useState(false);
    const [exerciseType, setExerciseType] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [setsRepsModal, setSetsRepsModal] = useState(false);
    const [isExerciseDetails, setIsExerciseDetails] = useState(false);
    const [currExercise, setCurrExercise] = useState(null);
    const [currExerciseToAdd, setCurrExerciseToAdd] = useState(null);
    const [isEditWorkout, setIsEditWorkout] = useState(false);

    useEffect(() => {
        if (!props.exercises.length) props.loadExercises()
    }, []);

    const onRemoveExercise = (exId) => {
        let newCurrWorkout = currWorkout.filter(exercise => exercise.id !== exId)
        setCurrWorkout(newCurrWorkout)
    }

    const onAddExerciseToWorkout = (exercise) => {
        setSetsRepsModal(true)
        setCurrExerciseToAdd(exercise)
    }

    const addExWithSetsReps = (sets, reps) => {
        if (!sets || !reps) return
        currExerciseToAdd['sets'] = sets
        currExerciseToAdd['reps'] = reps
        currWorkout.push(currExerciseToAdd)
        setCurrWorkout([...currWorkout])
        setSetsRepsModal(false)
    }

    const onToggleShowExercise = (exerciseType) => {
        setShowExercise(!showExercise)
        setExerciseType(exerciseType)
    }

    const onBackToAll = () => {
        setShowExercise(false)
        setIsExerciseDetails(false)
    }

    const onShowExerciseDetails = (exercise, isEditWorkout = false) => {
        setIsExerciseDetails(true)
        setCurrExercise(exercise)
        setIsEditWorkout(isEditWorkout)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const onHideDetails = () => {
        setIsExerciseDetails(false)
    }

    const saveNewWorkout = async (workoutTitle) => {
        if (!workoutTitle) return
        let workout = { workoutTitle, ex: currWorkout }
        user.workouts.push(workout)
        const res = await props.onUpdate(user)
        if (res) history.push("/menu")
    }

    const onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) return;
        const items = Array.from(currWorkout);
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setCurrWorkout(items)
    }

    return (
        <section className="build-workout-container">
            <Link to="/info"><h1 className="help-build pointer">Dont know how to build? click here!</h1></Link>
            {isExerciseDetails && <ExerciseDetails exercise={currExercise} onAddExerciseToWorkout={onAddExerciseToWorkout} onBackToAll={onBackToAll} onHideDetails={onHideDetails} isEditWorkout={isEditWorkout} />}
            {showExercise && <BuildWorkoutType exerciseType={exerciseType} onAddExerciseToWorkout={onAddExerciseToWorkout} onBackToAll={onBackToAll} onShowExerciseDetails={onShowExerciseDetails} />}
            {!showExercise &&
                <div className="workout-types-container">
                    <WorkoutTypes onToggleShowExercise={onToggleShowExercise} />
                </div>
            }
            <div className="curr-workout-container">
                <h1>Your current Workout:</h1>
                <DragDropContext onDragEnd={onDragEnd}>
                    <CurrWorkoutBuild currWorkout={currWorkout} onRemoveExercise={onRemoveExercise} />
                </DragDropContext>
                <button className="openModalBtn save-workout-btn" onClick={() => { setModalOpen(true) }}>Save New Workout!</button>
                {modalOpen && <ModalWorkoutName setOpenModal={setModalOpen} saveNewWorkout={saveNewWorkout} />}
                {setsRepsModal && <ModalSetRep setOpenModal={setSetsRepsModal} addExWithSetsReps={addExWithSetsReps} />}
            </div>
        </section>
    )
}

function mapStateToProps(state) {
    return {
        exercises: state.exerciseModule.exercises,
        user: state.userModule.loggedinUser,
    };
}

const mapDispatchToProps = {
    onUpdate,
    loadExercises
}

export const BuildWorkout = connect(mapStateToProps, mapDispatchToProps)(_BuildWorkout);