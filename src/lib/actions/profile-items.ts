'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Hobbies
export async function addHobby(formData: FormData) {
    const supabase = await createClient();

    const contentRaw = formData.get('content') as string;
    const content = contentRaw ? JSON.parse(contentRaw) : null;

    const { error } = await supabase.from('hobbies').insert({
        name: formData.get('name') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string || null,
        content,
        preview_image: formData.get('preview_image') as string || null,
        locale: formData.get('locale') as string || 'ko',
    });

    if (error) throw new Error(error.message);

    revalidatePath('/admin/profile/hobbies');
    revalidatePath('/[locale]/profile/hobbies', 'page');
    redirect('/admin/profile/hobbies');
}

export async function deleteHobby(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('hobbies').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/profile/hobbies');
    revalidatePath('/[locale]/profile/hobbies', 'page');
}

// Education
export async function addEducation(formData: FormData) {
    const supabase = await createClient();

    const contentRaw = formData.get('content') as string;
    const content = contentRaw ? JSON.parse(contentRaw) : null;

    const { error } = await supabase.from('education').insert({
        institution: formData.get('institution') as string,
        degree: formData.get('degree') as string,
        field: formData.get('field') as string || null,
        type: formData.get('type') as string,
        start_date: formData.get('start_date') as string,
        end_date: formData.get('end_date') as string || null,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string || null,
        content,
        preview_image: formData.get('preview_image') as string || null,
        locale: formData.get('locale') as string || 'ko',
    });

    if (error) throw new Error(error.message);

    revalidatePath('/admin/profile/education');
    revalidatePath('/[locale]/profile/timeline', 'page');
    redirect('/admin/profile/education');
}

export async function deleteEducation(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('education').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/profile/education');
    revalidatePath('/[locale]/profile/timeline', 'page');
}

// Work Experience
export async function addWorkExperience(formData: FormData) {
    const supabase = await createClient();

    const contentRaw = formData.get('content') as string;
    const content = contentRaw ? JSON.parse(contentRaw) : null;

    const { error } = await supabase.from('work_experience').insert({
        company: formData.get('company') as string,
        position: formData.get('position') as string,
        type: formData.get('type') as string,
        start_date: formData.get('start_date') as string,
        end_date: formData.get('end_date') as string || null,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string || null,
        content,
        preview_image: formData.get('preview_image') as string || null,
        locale: formData.get('locale') as string || 'ko',
    });

    if (error) throw new Error(error.message);

    revalidatePath('/admin/profile/work');
    revalidatePath('/[locale]/profile/timeline', 'page');
    redirect('/admin/profile/work');
}

export async function deleteWorkExperience(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('work_experience').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/profile/work');
    revalidatePath('/[locale]/profile/timeline', 'page');
}

// Clubs
export async function addClub(formData: FormData) {
    const supabase = await createClient();

    const contentRaw = formData.get('content') as string;
    const content = contentRaw ? JSON.parse(contentRaw) : null;

    const { error } = await supabase.from('clubs').insert({
        name: formData.get('name') as string,
        role: formData.get('role') as string || null,
        start_date: formData.get('start_date') as string,
        end_date: formData.get('end_date') as string || null,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string || null,
        content,
        preview_image: formData.get('preview_image') as string || null,
        locale: formData.get('locale') as string || 'ko',
    });

    if (error) throw new Error(error.message);

    revalidatePath('/admin/profile/clubs');
    revalidatePath('/[locale]/profile/timeline', 'page');
    redirect('/admin/profile/clubs');
}

export async function deleteClub(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('clubs').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/profile/clubs');
    revalidatePath('/[locale]/profile/timeline', 'page');
}

// Experiences
export async function addExperience(formData: FormData) {
    const supabase = await createClient();

    const contentRaw = formData.get('content') as string;
    const content = contentRaw ? JSON.parse(contentRaw) : null;

    const { error } = await supabase.from('experiences').insert({
        title: formData.get('title') as string,
        organization: formData.get('organization') as string || null,
        date: formData.get('date') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string || null,
        content,
        preview_image: formData.get('preview_image') as string || null,
        locale: formData.get('locale') as string || 'ko',
    });

    if (error) throw new Error(error.message);

    revalidatePath('/admin/profile/experiences-admin');
    revalidatePath('/[locale]/profile/experiences', 'page');
    redirect('/admin/profile/experiences-admin');
}

export async function deleteExperience(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('experiences').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/profile/experiences-admin');
    revalidatePath('/[locale]/profile/experiences', 'page');
}

// Certifications (no description field, skip)

// Awards
export async function addAward(formData: FormData) {
    const supabase = await createClient();

    const contentRaw = formData.get('content') as string;
    const content = contentRaw ? JSON.parse(contentRaw) : null;

    const { error } = await supabase.from('awards').insert({
        title: formData.get('title') as string,
        issuer: formData.get('issuer') as string,
        date: formData.get('date') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string || null,
        content,
        preview_image: formData.get('preview_image') as string || null,
        locale: formData.get('locale') as string || 'ko',
    });

    if (error) throw new Error(error.message);

    revalidatePath('/admin/profile/awards-admin');
    revalidatePath('/[locale]/profile/awards', 'page');
    redirect('/admin/profile/awards-admin');
}

export async function deleteAward(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('awards').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/profile/awards-admin');
    revalidatePath('/[locale]/profile/awards', 'page');
}

// Certifications
export async function addCertification(formData: FormData) {
    const supabase = await createClient();

    const contentRaw = formData.get('content') as string;
    const content = contentRaw ? JSON.parse(contentRaw) : null;

    const { error } = await supabase.from('certifications').insert({
        name: formData.get('name') as string,
        issuer: formData.get('issuer') as string,
        issue_date: formData.get('issue_date') as string,
        expiry_date: formData.get('expiry_date') as string || null,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string || null,
        content,
        preview_image: formData.get('preview_image') as string || null,
        locale: formData.get('locale') as string || 'ko',
    });

    if (error) throw new Error(error.message);

    revalidatePath('/admin/profile/certifications-admin');
    revalidatePath('/[locale]/profile/certifications', 'page');
    redirect('/admin/profile/certifications-admin');
}

export async function deleteCertification(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('certifications').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/admin/profile/certifications-admin');
    revalidatePath('/[locale]/profile/certifications', 'page');
}
