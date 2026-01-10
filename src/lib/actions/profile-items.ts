'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Hobbies
export async function addHobby(formData: FormData) {
    const supabase = await createClient();

    const contentRaw = formData.get('content') as string;
    const content = contentRaw ? JSON.parse(contentRaw) : null;
    const slug = formData.get('slug') as string;
    const locale = formData.get('locale') as string || 'ko';

    // 1. Insert into hobbies (shared)
    const { data: hobby, error: hobbyError } = await supabase
        .from('hobbies')
        .insert({
            slug,
            preview_image: formData.get('preview_image') as string || null,
        })
        .select()
        .single();

    if (hobbyError) throw new Error(hobbyError.message);

    // 2. Insert into hobby_translations
    const { error: transError } = await supabase.from('hobby_translations').insert({
        hobby_id: hobby.id,
        locale,
        name: formData.get('name') as string,
        description: formData.get('description') as string || null,
        content,
    });

    if (transError) throw new Error(transError.message);

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
    const slug = formData.get('slug') as string;
    const locale = formData.get('locale') as string || 'ko';

    // 1. Insert into education (shared)
    const { data: edu, error: eduError } = await supabase
        .from('education')
        .insert({
            slug,
            type: formData.get('type') as string,
            start_date: formData.get('start_date') as string,
            end_date: formData.get('end_date') as string || null,
            preview_image: formData.get('preview_image') as string || null,
        })
        .select()
        .single();

    if (eduError) throw new Error(eduError.message);

    // 2. Insert into education_translations
    const { error: transError } = await supabase.from('education_translations').insert({
        education_id: edu.id,
        locale,
        institution: formData.get('institution') as string,
        degree: formData.get('degree') as string,
        field: formData.get('field') as string || null,
        description: formData.get('description') as string || null,
        content,
    });

    if (transError) throw new Error(transError.message);

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
    const slug = formData.get('slug') as string;
    const locale = formData.get('locale') as string || 'ko';

    // 1. Insert into work_experience (shared)
    const { data: work, error: workError } = await supabase
        .from('work_experience')
        .insert({
            slug,
            type: formData.get('type') as string,
            start_date: formData.get('start_date') as string,
            end_date: formData.get('end_date') as string || null,
            preview_image: formData.get('preview_image') as string || null,
        })
        .select()
        .single();

    if (workError) throw new Error(workError.message);

    // 2. Insert into work_experience_translations
    const { error: transError } = await supabase.from('work_experience_translations').insert({
        work_experience_id: work.id,
        locale,
        company: formData.get('company') as string,
        position: formData.get('position') as string,
        location: formData.get('location') as string || null,
        description: formData.get('description') as string || null,
        content,
    });

    if (transError) throw new Error(transError.message);

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
    const slug = formData.get('slug') as string;
    const locale = formData.get('locale') as string || 'ko';

    // 1. Insert into clubs (shared)
    const { data: club, error: clubError } = await supabase
        .from('clubs')
        .insert({
            slug,
            start_date: formData.get('start_date') as string,
            end_date: formData.get('end_date') as string || null,
            preview_image: formData.get('preview_image') as string || null,
        })
        .select()
        .single();

    if (clubError) throw new Error(clubError.message);

    // 2. Insert into club_translations
    const { error: transError } = await supabase.from('club_translations').insert({
        club_id: club.id,
        locale,
        name: formData.get('name') as string,
        role: formData.get('role') as string || null,
        description: formData.get('description') as string || null,
        content,
    });

    if (transError) throw new Error(transError.message);

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
    const slug = formData.get('slug') as string;
    const locale = formData.get('locale') as string || 'ko';

    // 1. Insert into experiences (shared)
    const { data: xp, error: xpError } = await supabase
        .from('experiences')
        .insert({
            slug,
            date: formData.get('date') as string,
            preview_image: formData.get('preview_image') as string || null,
        })
        .select()
        .single();

    if (xpError) throw new Error(xpError.message);

    // 2. Insert into experience_translations
    const { error: transError } = await supabase.from('experience_translations').insert({
        experience_id: xp.id,
        locale,
        title: formData.get('title') as string,
        organization: formData.get('organization') as string || null,
        description: formData.get('description') as string || null,
        content,
    });

    if (transError) throw new Error(transError.message);

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
    const slug = formData.get('slug') as string;
    const locale = formData.get('locale') as string || 'ko';

    // 1. Insert into awards (shared)
    const { data: award, error: awardError } = await supabase
        .from('awards')
        .insert({
            slug,
            date: formData.get('date') as string,
            preview_image: formData.get('preview_image') as string || null,
        })
        .select()
        .single();

    if (awardError) throw new Error(awardError.message);

    // 2. Insert into award_translations
    const { error: transError } = await supabase.from('award_translations').insert({
        award_id: award.id,
        locale,
        title: formData.get('title') as string,
        issuer: formData.get('issuer') as string,
        description: formData.get('description') as string || null,
        content,
    });

    if (transError) throw new Error(transError.message);

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
    const slug = formData.get('slug') as string;
    const locale = formData.get('locale') as string || 'ko';

    // 1. Insert into certifications (shared)
    const { data: cert, error: certError } = await supabase
        .from('certifications')
        .insert({
            slug,
            issue_date: formData.get('issue_date') as string,
            expiry_date: formData.get('expiry_date') as string || null,
            preview_image: formData.get('preview_image') as string || null,
        })
        .select()
        .single();

    if (certError) throw new Error(certError.message);

    // 2. Insert into certification_translations
    const { error: transError } = await supabase.from('certification_translations').insert({
        certification_id: cert.id,
        locale,
        name: formData.get('name') as string,
        issuer: formData.get('issuer') as string,
        description: formData.get('description') as string || null,
        content,
    });

    if (transError) throw new Error(transError.message);

    revalidatePath('/admin/profile/certifications-admin');
    revalidatePath('/[locale]/profile/certifications', 'page');
    redirect('/admin/profile/certifications-admin');
}

export async function updateCertification(id: string, formData: FormData) {
    const supabase = await createClient();

    const contentRaw = formData.get('content') as string;
    const content = contentRaw ? JSON.parse(contentRaw) : null;
    const locale = formData.get('locale') as string || 'ko';

    // 1. Update certifications (shared)
    const { error: certError } = await supabase
        .from('certifications')
        .update({
            slug: formData.get('slug') as string,
            issue_date: formData.get('issue_date') as string,
            expiry_date: formData.get('expiry_date') as string || null,
            preview_image: formData.get('preview_image') as string || null,
        })
        .eq('id', id);

    if (certError) throw new Error(certError.message);

    // 2. Upsert certification_translations
    const { error: transError } = await supabase
        .from('certification_translations')
        .upsert({
            certification_id: id,
            locale,
            name: formData.get('name') as string,
            issuer: formData.get('issuer') as string,
            description: formData.get('description') as string || null,
            content,
        }, { onConflict: 'certification_id, locale' });

    if (transError) throw new Error(transError.message);

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

// Hobbies
export async function updateHobby(id: string, formData: FormData) {
    const supabase = await createClient();

    const contentRaw = formData.get('content') as string;
    const content = contentRaw ? JSON.parse(contentRaw) : null;
    const locale = formData.get('locale') as string || 'ko';

    // 1. Update hobbies (shared)
    const { error: hobbyError } = await supabase
        .from('hobbies')
        .update({
            slug: formData.get('slug') as string,
            preview_image: formData.get('preview_image') as string || null,
        })
        .eq('id', id);

    if (hobbyError) throw new Error(hobbyError.message);

    // 2. Upsert hobby_translations
    const { error: transError } = await supabase
        .from('hobby_translations')
        .upsert({
            hobby_id: id,
            locale,
            name: formData.get('name') as string,
            description: formData.get('description') as string || null,
            content,
        }, { onConflict: 'hobby_id, locale' });

    if (transError) throw new Error(transError.message);

    revalidatePath('/admin/profile/hobbies');
    revalidatePath('/[locale]/profile/hobbies', 'page');
    redirect('/admin/profile/hobbies');
}

// Education
export async function updateEducation(id: string, formData: FormData) {
    const supabase = await createClient();

    const contentRaw = formData.get('content') as string;
    const content = contentRaw ? JSON.parse(contentRaw) : null;
    const locale = formData.get('locale') as string || 'ko';

    // 1. Update education (shared)
    const { error: eduError } = await supabase
        .from('education')
        .update({
            slug: formData.get('slug') as string,
            type: formData.get('type') as string,
            start_date: formData.get('start_date') as string,
            end_date: formData.get('end_date') as string || null,
            preview_image: formData.get('preview_image') as string || null,
        })
        .eq('id', id);

    if (eduError) throw new Error(eduError.message);

    // 2. Upsert education_translations
    const { error: transError } = await supabase
        .from('education_translations')
        .upsert({
            education_id: id,
            locale,
            institution: formData.get('institution') as string,
            degree: formData.get('degree') as string,
            field: formData.get('field') as string || null,
            description: formData.get('description') as string || null,
            content,
        }, { onConflict: 'education_id, locale' });

    if (transError) throw new Error(transError.message);

    revalidatePath('/admin/profile/education');
    revalidatePath('/[locale]/profile/timeline', 'page');
    redirect('/admin/profile/education');
}

// Work Experience
export async function updateWorkExperience(id: string, formData: FormData) {
    const supabase = await createClient();

    const contentRaw = formData.get('content') as string;
    const content = contentRaw ? JSON.parse(contentRaw) : null;
    const locale = formData.get('locale') as string || 'ko';

    // 1. Update work_experience (shared)
    const { error: workError } = await supabase
        .from('work_experience')
        .update({
            slug: formData.get('slug') as string,
            type: formData.get('type') as string,
            start_date: formData.get('start_date') as string,
            end_date: formData.get('end_date') as string || null,
            preview_image: formData.get('preview_image') as string || null,
        })
        .eq('id', id);

    if (workError) throw new Error(workError.message);

    // 2. Upsert work_experience_translations
    const { error: transError } = await supabase
        .from('work_experience_translations')
        .upsert({
            work_experience_id: id,
            locale,
            company: formData.get('company') as string,
            position: formData.get('position') as string,
            location: formData.get('location') as string || null,
            description: formData.get('description') as string || null,
            content,
        }, { onConflict: 'work_experience_id, locale' });

    if (transError) throw new Error(transError.message);

    revalidatePath('/admin/profile/work');
    revalidatePath('/[locale]/profile/timeline', 'page');
    redirect('/admin/profile/work');
}

// Clubs
export async function updateClub(id: string, formData: FormData) {
    const supabase = await createClient();

    const contentRaw = formData.get('content') as string;
    const content = contentRaw ? JSON.parse(contentRaw) : null;
    const locale = formData.get('locale') as string || 'ko';

    // 1. Update clubs (shared)
    const { error: clubError } = await supabase
        .from('clubs')
        .update({
            slug: formData.get('slug') as string,
            start_date: formData.get('start_date') as string,
            end_date: formData.get('end_date') as string || null,
            preview_image: formData.get('preview_image') as string || null,
        })
        .eq('id', id);

    if (clubError) throw new Error(clubError.message);

    // 2. Upsert club_translations
    const { error: transError } = await supabase
        .from('club_translations')
        .upsert({
            club_id: id,
            locale,
            name: formData.get('name') as string,
            role: formData.get('role') as string || null,
            description: formData.get('description') as string || null,
            content,
        }, { onConflict: 'club_id, locale' });

    if (transError) throw new Error(transError.message);

    revalidatePath('/admin/profile/clubs');
    revalidatePath('/[locale]/profile/timeline', 'page');
    redirect('/admin/profile/clubs');
}

// Experiences
export async function updateExperience(id: string, formData: FormData) {
    const supabase = await createClient();

    const contentRaw = formData.get('content') as string;
    const content = contentRaw ? JSON.parse(contentRaw) : null;
    const locale = formData.get('locale') as string || 'ko';

    // 1. Update experiences (shared)
    const { error: xpError } = await supabase
        .from('experiences')
        .update({
            slug: formData.get('slug') as string,
            date: formData.get('date') as string,
            preview_image: formData.get('preview_image') as string || null,
        })
        .eq('id', id);

    if (xpError) throw new Error(xpError.message);

    // 2. Upsert experience_translations
    const { error: transError } = await supabase
        .from('experience_translations')
        .upsert({
            experience_id: id,
            locale,
            title: formData.get('title') as string,
            organization: formData.get('organization') as string || null,
            description: formData.get('description') as string || null,
            content,
        }, { onConflict: 'experience_id, locale' });

    if (transError) throw new Error(transError.message);

    revalidatePath('/admin/profile/experiences-admin');
    revalidatePath('/[locale]/profile/experiences', 'page');
    redirect('/admin/profile/experiences-admin');
}

// Awards
export async function updateAward(id: string, formData: FormData) {
    const supabase = await createClient();

    const contentRaw = formData.get('content') as string;
    const content = contentRaw ? JSON.parse(contentRaw) : null;
    const locale = formData.get('locale') as string || 'ko';

    // 1. Update awards (shared)
    const { error: awardError } = await supabase
        .from('awards')
        .update({
            slug: formData.get('slug') as string,
            date: formData.get('date') as string,
            preview_image: formData.get('preview_image') as string || null,
        })
        .eq('id', id);

    if (awardError) throw new Error(awardError.message);

    // 2. Upsert award_translations
    const { error: transError } = await supabase
        .from('award_translations')
        .upsert({
            award_id: id,
            locale,
            title: formData.get('title') as string,
            issuer: formData.get('issuer') as string,
            description: formData.get('description') as string || null,
            content,
        }, { onConflict: 'award_id, locale' });

    if (transError) throw new Error(transError.message);

    revalidatePath('/admin/profile/awards-admin');
    revalidatePath('/[locale]/profile/awards', 'page');
    redirect('/admin/profile/awards-admin');
}
