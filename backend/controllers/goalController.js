const asyncHandler = require('express-async-handler')

const Goal = require('../models/goalModel')
const User = require('../models/userModel')

//@desc get goals
//@route GET /api/goals
//@access Private

const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({user: req.user.id})
    res.status(200).json(goals)
})

//@desc Set goals
//@route POST /api/goals
//@access Private

const setGoal = asyncHandler(async (req, res) => {
    if(!req.body.text) {
        res.status(400)
        throw new Error('please add a text field')
    }
     
    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })
    res.status(200).json(goal)
})

//@desc UPDATE goals
//@route PUT /api/goals/:id
//@access Private

const updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)

    if(!goal) {
        res.status(400)
        throw new Error('goal not found')
    }

    const user = await User.findById(req.user.id)

    //check for user
    if(!user) {
        res.status(401)
        throw new Error('user not found')
    }

    //make sure the logged in user mathces the goal user
    if(goal.user.toString() !== user.id) {
      res.status(401)
      throw new Error('user not authorised')
    }


    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id,
        req.body, {
            new : true
        }
    )
    res.status(200).json(updatedGoal)
})

//@desc Delete goal
//@route DELETE /api/goals/:id
//@access Private

const deleteGoal = asyncHandler(async (req, res) => {
     
    const goal = await Goal.findById(req.params.id)

    if(!goal) {
        res.status(400)
        throw new Error('goal not found')
    }

     const user = await User.findById(req.user.id)

    //check for user
    if(!user) {
        res.status(401)
        throw new Error('user not found')
    }

    //make sure the logged in user mathces the goal user
    if(goal.user.toString() !== user.id) {
      res.status(401)
      throw new Error('user not authorised')
    }

    await goal.deleteOne()

    res.status(200).json({if: req.params.id})
})

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal
}