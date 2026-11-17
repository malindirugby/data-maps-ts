import { UserModules } from './user.registry';
import type { User } from './user.types';

export type AuthenticatedUser = User & {
    config: UserModules;
};

const user: AuthenticatedUser = {
    id: "user_001",
    email: "john@example.com",
    username: "john",
    createdAt: new Date().toISOString(),
    

    config: {

        userProfile: {
            names: "",
            phoneNumber: "",
            age: 28,
            gender: "male",
        },

        teamMemberShips: [
            {
                id: "",
                userId: "",
                teamId: "",
                role: "member",
                status: "active",
                joinedAt: "",
                invitedAt: "",
                team: [
                    {
                        id: "",
                        name: "",
                        description: "",
                        createdAt: new Date().toISOString(),
                    }
                ]
            }
        ],

        programs: [
            {
                schools: [
                    {
                        id: "",
                        registrationNumber: "",
                        schoolDetails: {
                            id: "",
                            name: "",
                            category: "combined_jss_senior",
                            schoolType: "private",
                            address: {
                                street: "",
                                city: "",
                                countyOrState: "",
                                postalCode: "",
                            },
                            facilityDetails: {
                                hasOwnPitch: true,
                                pitchSurfaceType: "grass",
                                hasFloodlights: false,
                                changingRoomsAvailable: true
                            }
                        },
                        contacts: [
                            {
                                firstName: "",
                                lastName: "",
                                email: "",
                                phone: "",
                                role: ""
                            }
                        ],
                        programTier: {
                            id: "",
                            name: "",
                            description: "",
                            benefits: [],
                            isFree: false,
                            PaymentDetails: {
                                paymentProvider: "other",
                                price: 0,
                            }
                        },
                        sessionFrequency: {
                            type: "bi_weekly",
                            weekDays: [ "tuesday", "thursday", "saturday"],
                            preferredTime: {
                                startTime: "",
                                endTime: "",
                            }
                        },
                        class: [
                            {
                                gradeLevel: ["grade_7", "grade_8", "grade_9"],
                                estimatedStudentCount: 45,
                                genderCategory: "mixed",
                            }
                        ],
                        requirements: {
                            focusAreas: ["sevens", "tactics", "tackling_safety"],
                            coachesRequestedCount: 2,
                            coachingLevelRequired: "level_2",
                            equipmentProvidedBySchool: true,
                        },
                        proposedStartDate: "",
                        proposedEndDate: "",
                        totalWeeks: 4,

                        status: "draft",

                        termsAccepted: true,
                        termsAcceptedAt: "",
                        medicalDisclaimerSigned: true,
                        specialNotesOrRequests: "",

                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    }
                ]
            }
        ]
    }
};