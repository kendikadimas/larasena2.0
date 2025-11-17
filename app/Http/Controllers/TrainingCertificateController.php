<?php

namespace App\Http\Controllers;

use App\Models\TrainingCertificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TrainingCertificateController extends Controller
{
    public function index()
    {
        $certificates = TrainingCertificate::with('course.lessons')
            ->where('user_id', Auth::id())
            ->orderBy('issued_at', 'desc')
            ->get()
            ->map(function ($cert) {
                return [
                    'id' => $cert->id,
                    'certificate_number' => $cert->certificate_number,
                    'issued_at' => $cert->issued_at->format('d M Y'),
                    'course' => [
                        'id' => $cert->course->id,
                        'title' => $cert->course->title,
                        'level' => $cert->course->level,
                        'level_label' => $cert->course->level_label,
                        'thumbnail' => $cert->course->thumbnail,
                        'lessons_count' => $cert->course->lessons->count()
                    ]
                ];
            });

        return Inertia::render('Training/Certificates', [
            'certificates' => $certificates
        ]);
    }

    public function show(TrainingCertificate $certificate)
    {
        // Public view - no auth check
        $certificate->load('course.lessons', 'user');

        return Inertia::render('Training/ShowCertificate', [
            'certificate' => [
                'id' => $certificate->id,
                'certificate_number' => $certificate->certificate_number,
                'issued_at' => $certificate->issued_at->format('d F Y'),
                'user' => [
                    'name' => $certificate->user->name
                ],
                'course' => [
                    'title' => $certificate->course->title,
                    'level' => $certificate->course->level,
                    'level_label' => $certificate->course->level_label,
                    'lessons_count' => $certificate->course->lessons->count()
                ]
            ],
            'auth' => Auth::check() ? ['user' => Auth::user()] : null
        ]);
    }

    public function download(TrainingCertificate $certificate)
    {
        $certificate->load('course');
        
        // Check if course has uploaded certificate file
        if ($certificate->course->certificate_file) {
            $filePath = storage_path('app/public/' . $certificate->course->certificate_file);
            
            if (file_exists($filePath)) {
                $extension = pathinfo($certificate->course->certificate_file, PATHINFO_EXTENSION);
                $fileName = 'Sertifikat-' . $certificate->certificate_number . '.' . $extension;
                
                return response()->download($filePath, $fileName);
            }
        }
        
        // Fallback: redirect to certificate view if no file uploaded
        return redirect()->route('training.certificates.show', $certificate);
    }
}
