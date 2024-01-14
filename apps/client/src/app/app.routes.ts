import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './presentation/layouts/dashboardLayout/dashboardLayout.component';

export const routes: Routes = [
{
        path: '',
        component: DashboardLayoutComponent,
        children: [
            {
                path: 'grammar-checker',
                loadComponent: () => import('./presentation/layouts/pages/grammarCheckerPage/grammarCheckerPage.component'),
                data: {
                    icon: 'fa-solid fa-spell-check',
                    title: 'Grammar Checker',
                    description: 'Check your grammar',
                },
            },
            {
                path: 'pros-and-cons',
                loadComponent: () => import('./presentation/layouts/pages/prosConsPage/prosConsPage.component'),
                data: {
                    icon: 'fa-solid fa-code-compare',
                    title: 'Pros and Cons',
                    description: 'List the pros and cons',
                },
            },
            {
                path: 'pros-const-stream',
                loadComponent: () => import('./presentation/layouts/pages/prosConsStreamPage/prosConsStreamPage.component'),
                data: {
                    icon: 'fa-solid fa-water',
                    title: 'Pros and Cons Stream',
                    description: 'List the pros and cons',
                },
            },
            {
                path: 'translate',
                loadComponent: () => import('./presentation/layouts/pages/translatePage/translatePage.component'),
                data: {
                    icon: 'fa-solid fa-language',
                    title: 'Translate',
                    description: 'Translate your text to another language   ',
                },
            },  
            {
                path: 'text-to-speech',
                loadComponent: () => import('./presentation/layouts/pages/textToSpeechPage/textToSpeechPage.component'),
                data: {
                    icon: 'fa-solid fa-podcast',
                    title: 'Text to Speech',
                    description: 'Convert your text to speech',
                },
            },  
            {
                path: 'speech-to-text',
                loadComponent: () => import('./presentation/layouts/pages/speechToTextPage/speechToTextPage.component'),
                data: {
                    icon: 'fa-solid fa-comment-dots',
                    title: 'Speech to Text',
                    description: 'Convert your speech to text',
                },
            },  
            {
                path: 'image-generator',
                loadComponent: () => import('./presentation/layouts/pages/imageGenerationPage/imageGenerationPage.component'),
                data: {
                    icon: 'fa-solid fa-image',
                    title: 'Image Generator',
                    description: 'Generate an image',
                },
            },  
            {
                path: 'image-tuning',   
                loadComponent: () => import('./presentation/layouts/pages/imageTuningPage/imageTuningPage.component'),
                data: {
                    icon: 'fa-solid fa-wand-magic',
                    title: 'Image Tuning',
                    description: 'Tune my image',
                },
            },  
            {
                path: 'assistant',
                loadComponent: () => import('./presentation/layouts/pages/assistantPage/assistantPage.component'),
                data: {
                    icon: 'fa-solid fa-robot',
                    title: 'Assistant',
                    description: 'Information from the assistant',
                },
            },  
            {
                path: '**',
                redirectTo: 'grammar-checker',
                pathMatch: 'full',
            },  
        ],
    },
];
