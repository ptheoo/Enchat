/**
 * GrammarService - Service quản lý các chủ đề ngữ pháp và kết nối với backend
 */

export class GrammarService {
    constructor() {
        this.topics = this.initializeTopics();
        this.currentTopic = 'basic-grammar';
        this.baseURL = 'http://127.0.0.1:8000/api/v1';
    }

    // Khởi tạo các chủ đề ngữ pháp
    initializeTopics() {
        return {
            'basic-grammar': {
                id: 'basic-grammar',
                title: 'Ngữ pháp cơ bản',
                description: 'Hỏi đáp về các quy tắc ngữ pháp tiếng Anh cơ bản',
                icon: 'fas fa-book',
                color: '#6366f1',
                questions: [
                    'Thì hiện tại đơn là gì?',
                    'Cách sử dụng a/an/the?',
                    'Sự khác biệt giữa much và many?',
                    'Cách chia động từ theo chủ ngữ?',
                    'Quy tắc sử dụng am/is/are?'
                ],
                examples: [
                    'I am a student.',
                    'She likes reading books.',
                    'They are playing football.'
                ]
            },
            'tenses': {
                id: 'tenses',
                title: 'Thì trong tiếng Anh',
                description: 'Học và hiểu các thì trong tiếng Anh',
                icon: 'fas fa-clock',
                color: '#10b981',
                questions: [
                    'Thì hiện tại đơn dùng khi nào?',
                    'Cách sử dụng thì hiện tại tiếp diễn?',
                    'Thì quá khứ đơn có gì đặc biệt?',
                    'Khi nào dùng thì tương lai?',
                    'Sự khác biệt giữa các thì?'
                ],
                examples: [
                    'I go to school every day. (Present Simple)',
                    'I am studying now. (Present Continuous)',
                    'I went to school yesterday. (Past Simple)',
                    'I will go to school tomorrow. (Future Simple)'
                ]
            },
            'parts-of-speech': {
                id: 'parts-of-speech',
                title: 'Từ loại',
                description: 'Tìm hiểu về danh từ, động từ, tính từ và các từ loại khác',
                icon: 'fas fa-tags',
                color: '#f59e0b',
                questions: [
                    'Danh từ là gì và cách sử dụng?',
                    'Động từ có những loại nào?',
                    'Tính từ đứng ở vị trí nào?',
                    'Trạng từ bổ nghĩa cho gì?',
                    'Đại từ có vai trò gì?'
                ],
                examples: [
                    'Noun: book, student, school',
                    'Verb: read, study, play',
                    'Adjective: beautiful, smart, tall',
                    'Adverb: quickly, slowly, well'
                ]
            },
            'sentence-structure': {
                id: 'sentence-structure',
                title: 'Cấu trúc câu',
                description: 'Học cách xây dựng câu đúng ngữ pháp',
                icon: 'fas fa-sitemap',
                color: '#8b5cf6',
                questions: [
                    'Cấu trúc câu cơ bản như thế nào?',
                    'Cách sử dụng câu phức?',
                    'Câu điều kiện có mấy loại?',
                    'Cách đặt câu hỏi đúng?',
                    'Quy tắc đảo ngữ trong câu?'
                ],
                examples: [
                    'Subject + Verb + Object',
                    'Subject + Verb + Adjective',
                    'Subject + Verb + Adverb',
                    'If + Present Simple, Future Simple'
                ]
            },
            'common-mistakes': {
                id: 'common-mistakes',
                title: 'Lỗi thường gặp',
                description: 'Tránh những lỗi ngữ pháp phổ biến',
                icon: 'fas fa-exclamation-triangle',
                color: '#ef4444',
                questions: [
                    'Lỗi thường gặp khi chia động từ?',
                    'Sai lầm khi sử dụng giới từ?',
                    'Lỗi về thì trong tiếng Anh?',
                    'Cách tránh lỗi về từ loại?',
                    'Lỗi về cấu trúc câu?'
                ],
                examples: [
                    '❌ I am go to school → ✅ I go to school',
                    '❌ She have a car → ✅ She has a car',
                    '❌ I am study English → ✅ I study English',
                    '❌ I am like music → ✅ I like music'
                ]
            }
        };
    }

    // Lấy tất cả chủ đề
    getAllTopics() {
        return Object.values(this.topics);
    }

    // Lấy chủ đề theo ID
    getTopicById(topicId) {
        return this.topics[topicId] || this.topics['basic-grammar'];
    }

    // Lấy chủ đề hiện tại
    getCurrentTopic() {
        return this.topics[this.currentTopic];
    }

    // Thay đổi chủ đề
    setCurrentTopic(topicId) {
        if (this.topics[topicId]) {
            this.currentTopic = topicId;
            return true;
        }
        return false;
    }

    // Lấy câu hỏi gợi ý cho chủ đề
    getTopicQuestions(topicId) {
        const topic = this.getTopicById(topicId);
        return topic ? topic.questions : [];
    }

    // Lấy ví dụ cho chủ đề
    getTopicExamples(topicId) {
        const topic = this.getTopicById(topicId);
        return topic ? topic.examples : [];
    }

    // Tạo câu hỏi ngẫu nhiên
    getRandomQuestion(topicId = null) {
        const topic = topicId ? this.getTopicById(topicId) : this.getCurrentTopic();
        if (!topic || !topic.questions.length) return null;
        
        const randomIndex = Math.floor(Math.random() * topic.questions.length);
        return topic.questions[randomIndex];
    }

    // Lấy câu hỏi theo độ khó
    getQuestionsByDifficulty(topicId, difficulty = 'easy') {
        const topic = this.getTopicById(topicId);
        if (!topic) return [];

        // TODO: Implement difficulty levels
        return topic.questions;
    }

    // Tìm kiếm chủ đề
    searchTopics(query) {
        const results = [];
        const searchTerm = query.toLowerCase();

        Object.values(this.topics).forEach(topic => {
            if (topic.title.toLowerCase().includes(searchTerm) ||
                topic.description.toLowerCase().includes(searchTerm) ||
                topic.questions.some(q => q.toLowerCase().includes(searchTerm))) {
                results.push(topic);
            }
        });

        return results;
    }

    // Lấy thông tin chi tiết về chủ đề từ backend
    async getTopicDetails(topicId) {
        try {
            const response = await fetch(`${this.baseURL}/grammar/topics/${topicId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                return this.getTopicById(topicId); // Fallback to local data
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Lỗi khi lấy thông tin chủ đề:', error);
            return this.getTopicById(topicId); // Fallback to local data
        }
    }

    // Lấy bài tập cho chủ đề
    async getTopicExercises(topicId) {
        try {
            const response = await fetch(`${this.baseURL}/grammar/exercises/${topicId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                return this.generateDefaultExercises(topicId);
            }

            const data = await response.json();
            return data.exercises || [];

        } catch (error) {
            console.error('Lỗi khi lấy bài tập:', error);
            return this.generateDefaultExercises(topicId);
        }
    }

    // Tạo bài tập mặc định
    generateDefaultExercises(topicId) {
        const topic = this.getTopicById(topicId);
        if (!topic) return [];

        const exercises = {
            'basic-grammar': [
                {
                    id: 1,
                    type: 'multiple-choice',
                    question: 'Chọn câu đúng:',
                    options: [
                        'I am go to school',
                        'I go to school',
                        'I goes to school',
                        'I going to school'
                    ],
                    correct: 1,
                    explanation: 'Với chủ ngữ "I", động từ "go" không cần chia.'
                }
            ],
            'tenses': [
                {
                    id: 1,
                    type: 'multiple-choice',
                    question: 'Chọn thì phù hợp: "I _____ to school every day."',
                    options: [
                        'am going',
                        'go',
                        'went',
                        'will go'
                    ],
                    correct: 1,
                    explanation: 'Thì hiện tại đơn diễn tả thói quen hàng ngày.'
                }
            ]
        };

        return exercises[topicId] || [];
    }

    // Lấy quy tắc ngữ pháp cho chủ đề
    async getTopicRules(topicId) {
        try {
            const response = await fetch(`${this.baseURL}/grammar/rules/${topicId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                return this.generateDefaultRules(topicId);
            }

            const data = await response.json();
            return data.rules || [];

        } catch (error) {
            console.error('Lỗi khi lấy quy tắc:', error);
            return this.generateDefaultRules(topicId);
        }
    }

    // Tạo quy tắc mặc định
    generateDefaultRules(topicId) {
        const rules = {
            'basic-grammar': [
                'Sử dụng "am/is/are" với chủ ngữ số ít',
                'Sử dụng "are" với chủ ngữ số nhiều',
                'Động từ thường không thay đổi với chủ ngữ số ít'
            ],
            'tenses': [
                'Present Simple: diễn tả thói quen, sự thật',
                'Present Continuous: diễn tả hành động đang xảy ra',
                'Past Simple: diễn tả hành động đã xảy ra trong quá khứ'
            ],
            'parts-of-speech': [
                'Noun: chỉ người, vật, nơi chốn, ý tưởng',
                'Verb: chỉ hành động hoặc trạng thái',
                'Adjective: mô tả tính chất của danh từ'
            ],
            'sentence-structure': [
                'Mỗi câu phải có ít nhất một chủ ngữ và một động từ',
                'Tính từ đứng trước danh từ',
                'Trạng từ có thể đứng đầu, giữa hoặc cuối câu'
            ],
            'common-mistakes': [
                'Không sử dụng "am/is/are" với động từ thường',
                'Chú ý chia động từ theo chủ ngữ',
                'Sử dụng đúng giới từ cho mỗi động từ'
            ]
        };

        return rules[topicId] || [];
    }

    // Lấy tiến độ học của người dùng
    async getUserProgress() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;

            const response = await fetch(`${this.baseURL}/grammar/progress`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                return this.generateDefaultProgress();
            }

            const data = await response.json();
            return data.progress || this.generateDefaultProgress();

        } catch (error) {
            console.error('Lỗi khi lấy tiến độ:', error);
            return this.generateDefaultProgress();
        }
    }

    // Tạo tiến độ mặc định
    generateDefaultProgress() {
        const progress = {};
        Object.keys(this.topics).forEach(topicId => {
            progress[topicId] = {
                completed: 0,
                total: 10,
                percentage: Math.floor(Math.random() * 100),
                lastStudied: new Date().toISOString()
            };
        });
        return progress;
    }

    // Cập nhật tiến độ học
    async updateProgress(topicId, completed, total) {
        try {
            const token = localStorage.getItem('token');
            if (!token) return false;

            const response = await fetch(`${this.baseURL}/grammar/progress`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topic_id: topicId,
                    completed: completed,
                    total: total
                })
            });

            return response.ok;

        } catch (error) {
            console.error('Lỗi khi cập nhật tiến độ:', error);
            return false;
        }
    }

    // Lấy gợi ý học tập
    getStudySuggestions() {
        const suggestions = [];
        const progress = this.generateDefaultProgress();

        // Sắp xếp theo tiến độ thấp nhất
        const sortedTopics = Object.entries(progress)
            .sort(([,a], [,b]) => a.percentage - b.percentage)
            .slice(0, 3);

        sortedTopics.forEach(([topicId, data]) => {
            const topic = this.getTopicById(topicId);
            if (topic) {
                suggestions.push({
                    topic: topic,
                    reason: `Tiến độ: ${data.percentage}%`,
                    priority: 'high'
                });
            }
        });

        return suggestions;
    }

    // Lấy thống kê học tập
    async getStudyStats() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return this.generateDefaultStats();

            const response = await fetch(`${this.baseURL}/grammar/stats`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                return this.generateDefaultStats();
            }

            const data = await response.json();
            return data.stats || this.generateDefaultStats();

        } catch (error) {
            console.error('Lỗi khi lấy thống kê:', error);
            return this.generateDefaultStats();
        }
    }

    // Tạo thống kê mặc định
    generateDefaultStats() {
        return {
            totalStudyTime: Math.floor(Math.random() * 120) + 30, // 30-150 phút
            topicsCompleted: Math.floor(Math.random() * 3) + 1, // 1-3 chủ đề
            exercisesCompleted: Math.floor(Math.random() * 50) + 10, // 10-60 bài tập
            currentStreak: Math.floor(Math.random() * 7) + 1, // 1-7 ngày
            bestStreak: Math.floor(Math.random() * 14) + 7 // 7-21 ngày
        };
    }
}
