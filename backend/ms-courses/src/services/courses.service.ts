import { CoursesRepository } from '../repositories/courses.repository.js';
import type { ICoursesRepository } from '../repositories/courses.repository.interface.js';
import { CourseSubjectsService } from './course-subjects.service.js';
import type { ICourseSubjectsService } from './course-subjects.service.interface.js';
import type { ICoursesService } from './courses.service.interface.js';
import type { Course, Subject } from '../types/course.types.js';

export class CoursesService implements ICoursesService {
  private repo: ICoursesRepository;
  private courseSubjectsService: ICourseSubjectsService;

  constructor(repo?: ICoursesRepository, courseSubjectsService?: ICourseSubjectsService) {
    this.repo = repo ?? new CoursesRepository();
    this.courseSubjectsService = courseSubjectsService ?? new CourseSubjectsService();
  }

  async listCourses(): Promise<Course[]> {
    return this.repo.findAll();
  }

  async getCourse(id: number): Promise<Course & { subjects: Subject[] }> {
    const course = await this.repo.findById(id);
    if (!course) throw new Error('Curso no encontrado');
    const subjects = await this.courseSubjectsService.getSubjectsByCourse(id);
    return { ...course, subjects };
  }

  async createCourse(data: Course): Promise<any> {
    const existing = await this.repo.findAll();
    const duplicate = existing.find(c => c.name === data.name);
    if (duplicate) throw new Error('Ya existe un curso con ese nombre');
    return this.repo.create(data);
  }

  async updateCourse(id: number, data: Partial<Course>): Promise<void> {
    const course = await this.repo.findById(id);
    if (!course) throw new Error('Curso no encontrado');
    await this.repo.update(id, data);
  }

  async deleteCourse(id: number): Promise<void> {
    const course = await this.repo.findById(id);
    if (!course) throw new Error('Curso no encontrado');
    await this.repo.delete(id);
  }
}
