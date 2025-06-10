// app/superadmin/edit/[slug]/page.js
'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { mutate } from 'swr'; // Import mutate for revalidation

// Define the fetcher function for GET requests
const fetcher = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'An error occurred while fetching the data.');
    }
    return res.json();
};

function Page({ params }) {
    const { slug } = params;

    // SWR hook to fetch the initial question data
    const { data: initialQuestion, error, isLoading } = useSWR(
        `/api/question/superadmin/editquestion/${slug}`,
        fetcher
    );

    // State to hold the editable question data
    // Initialize with a default structure to avoid errors before data loads
    const [editedQuestion, setEditedQuestion] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(''); // 'success', 'error', 'loading', ''

    // Effect to update the editedQuestion state when initialQuestion data loads or changes
    useEffect(() => {
        if (initialQuestion) {
            // Deep copy to ensure no direct mutation of SWR's cached data
            setEditedQuestion(JSON.parse(JSON.stringify(initialQuestion)));
        }
    }, [initialQuestion]);

    if (isLoading) {
        return <div className="p-4 text-white">Loading question...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">Failed to load question: {error.message}</div>;
    }

    if (!initialQuestion || !editedQuestion) {
        // If data is not available after loading (e.g., 404 from API)
        return <div className="p-4 text-yellow-600">Question not found.</div>;
    }

    // --- Handlers for input changes ---
    const handleQuestionTextChange = (e) => {
        setEditedQuestion(prev => ({
            ...prev,
            question: {
                ...prev.question,
                text: e.target.value
            }
        }));
    };

    const handleQuestionImageUrlChange = (e) => {
        setEditedQuestion(prev => ({
            ...prev,
            question: {
                ...prev.question,
                imageUrl: e.target.value
            }
        }));
    };

    const handleOptionTextChange = (optionKey, e) => {
        setEditedQuestion(prev => ({
            ...prev,
            options: {
                ...prev.options,
                [optionKey]: {
                    ...prev.options[optionKey],
                    text: e.target.value
                }
            }
        }));
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setEditedQuestion(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // --- Function to send update to the API ---
    const handleUpdate = async (e) => {
        e.preventDefault(); // Prevent default form submission

        setIsUpdating(true);
        setUpdateStatus('loading');

        try {
            const res = await fetch(`/api/question/superadmin/editquestion/${slug}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedQuestion), // Send the entire editedQuestion object
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to update question.');
            }

            const updatedData = await res.json();
            setUpdateStatus('success');
            console.log('Question updated successfully:', updatedData);

            // Revalidate SWR cache to fetch the latest data from the server
            // This ensures the UI reflects the changes that happened in the DB
            mutate(`/api/question/superadmin/editquestion/${slug}`);

        } catch (err) {
            setUpdateStatus('error');
            console.error('Error updating question:', err);
            // You might want to display a more specific error message to the user
        } finally {
            setIsUpdating(false);
            // Clear status after a short delay
            setTimeout(() => setUpdateStatus(''), 3000);
        }
    };

    return (
        <div className="bg-black min-h-screen p-8 text-white">
            <h1 className='text-3xl font-bold mb-6 text-center'>Edit Question (ID: {slug})</h1>

            <form onSubmit={handleUpdate} className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                {/* Status messages */}
                {updateStatus === 'loading' && (
                    <div className="bg-blue-500 text-white p-3 rounded mb-4 text-center">Updating...</div>
                )}
                {updateStatus === 'success' && (
                    <div className="bg-green-500 text-white p-3 rounded mb-4 text-center">Update successful!</div>
                )}
                {updateStatus === 'error' && (
                    <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">Update failed. Please try again.</div>
                )}

                {/* Question Text */}
                <div className="mb-4">
                    <label htmlFor="questionText" className="block text-lg font-medium mb-2">Question Text:</label>
                    <textarea
                        id="questionText"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 h-32"
                        value={editedQuestion.question.text || ''}
                        onChange={handleQuestionTextChange}
                        rows="5"
                    />
                </div>

                {/* Question Image URL */}
                <div className="mb-4">
                    <label htmlFor="questionImageUrl" className="block text-lg font-medium mb-2">Image URL:</label>
                    <input
                        type="text"
                        id="questionImageUrl"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                        value={editedQuestion.question.imageUrl || ''}
                        onChange={handleQuestionImageUrlChange}
                    />
                    {editedQuestion.question.imageUrl && (
                        <img src={editedQuestion.question.imageUrl} alt="Current Question" className="mt-4 max-w-xs h-auto rounded shadow-md" />
                    )}
                </div>

                {/* Options */}
                <div className="mb-6">
                    <h2 className="text-lg font-medium mb-3">Options:</h2>
                    {Object.keys(editedQuestion.options).map(optionKey => (
                        <div key={optionKey} className="mb-3">
                            <label htmlFor={`option-${optionKey}`} className="block text-md font-medium mb-1 capitalize">
                                {optionKey.replace('option', 'Option ')}:
                            </label>
                            <textarea
                                id={`option-${optionKey}`}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                                value={editedQuestion.options[optionKey].text || ''}
                                onChange={(e) => handleOptionTextChange(optionKey, e)}
                                rows="2"
                            />
                        </div>
                    ))}
                </div>

                {/* Other fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="type" className="block text-lg font-medium mb-2">Type:</label>
                        <input
                            type="text"
                            id="type"
                            name="type"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                            value={editedQuestion.type || ''}
                            onChange={handleFieldChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="correctOption" className="block text-lg font-medium mb-2">Correct Option:</label>
                        <select
                            id="correctOption"
                            name="correctOption"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                            value={editedQuestion.correctOption || ''}
                            onChange={handleFieldChange}
                        >
                            <option value="">Select Correct Option</option>
                            {Object.keys(editedQuestion.options).map(optionKey => (
                                <option key={optionKey} value={optionKey}>{optionKey.replace('option', 'Option ')}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="answer" className="block text-lg font-medium mb-2">Answer:</label>
                        <input
                            type="text"
                            id="answer"
                            name="answer"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                            value={editedQuestion.answer || ''}
                            onChange={handleFieldChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="explanation" className="block text-lg font-medium mb-2">Explanation:</label>
                        <textarea
                            id="explanation"
                            name="explanation"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                            value={editedQuestion.explanation || ''}
                            onChange={handleFieldChange}
                            rows="3"
                        />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-lg font-medium mb-2">Subject:</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                            value={editedQuestion.subject || ''}
                            onChange={handleFieldChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="topic" className="block text-lg font-medium mb-2">Topic:</label>
                        <input
                            type="text"
                            id="topic"
                            name="topic"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                            value={editedQuestion.topic || ''}
                            onChange={handleFieldChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="level" className="block text-lg font-medium mb-2">Level:</label>
                        <input
                            type="text"
                            id="level"
                            name="level"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                            value={editedQuestion.level || ''}
                            onChange={handleFieldChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="unit" className="block text-lg font-medium mb-2">Unit:</label>
                        <input
                            type="text"
                            id="unit"
                            name="unit"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                            value={editedQuestion.unit || ''}
                            onChange={handleFieldChange}
                        />
                    </div>
                     <div>
                        <label htmlFor="publication" className="block text-lg font-medium mb-2">Publication:</label>
                        <input
                            type="text"
                            id="publication"
                            name="publication"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                            value={editedQuestion.publication || ''}
                            onChange={handleFieldChange}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Updating...' : 'Update Question'}
                </button>
            </form>
        </div>
    );
}

export default Page;