'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { InfoIcon, BookIcon, ShieldIcon, SmartphoneIcon, HomeIcon, MailIcon, TagIcon, ExternalLinkIcon } from 'lucide-react'

export function Footer() {
    const t = useTranslations();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-white pt-16 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
                    {/* VangLang Budget */}
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center text-primary-foreground font-bold">
                                VLB
                            </div>
                            <span className="text-xl font-semibold">{t('app.name')}</span>
                        </div>
                        <p className="text-muted-foreground">
                            {t('footer.aboutDescription')}
                        </p>
                    </div>

                    {/* Liên kết */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">{t('footer.links.title')}</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="/about" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                                    <InfoIcon className="w-4 h-4 mr-2" />
                                    <span>{t('footer.links.aboutUs')}</span>
                                </a>
                            </li>
                            <li>
                                <a href="/features" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                                    <TagIcon className="w-4 h-4 mr-2" />
                                    <span>{t('footer.links.features')}</span>
                                </a>
                            </li>
                            <li>
                                <a href="/roadmap" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                                    <ExternalLinkIcon className="w-4 h-4 mr-2" />
                                    <span>{t('roadmap.title')}</span>
                                </a>
                            </li>
                            <li>
                                <a href="/pricing" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                                    <TagIcon className="w-4 h-4 mr-2" />
                                    <span>{t('footer.links.pricing')}</span>
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                                    <MailIcon className="w-4 h-4 mr-2" />
                                    <span>{t('footer.links.contact')}</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Pháp lý */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">{t('footer.legal.title')}</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="/legal-404" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                                    <BookIcon className="w-4 h-4 mr-2" />
                                    <span>{t('footer.legal.terms')}</span>
                                </a>
                            </li>
                            <li>
                                <a href="/legal-404" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                                    <ShieldIcon className="w-4 h-4 mr-2" />
                                    <span>{t('footer.legal.privacy')}</span>
                                </a>
                            </li>
                            <li>
                                <a href="/legal-404" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                                    <ShieldIcon className="w-4 h-4 mr-2" />
                                    <span>{t('footer.legal.cookies')}</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Tải ứng dụng */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">{t('footer.app.title')}</h3>
                        <div className="flex items-center text-muted-foreground mb-4">
                            <SmartphoneIcon className="w-5 h-5 mr-2" />
                            <span>{t('footer.app.description')}</span>
                        </div>
                        <div className="mt-4 flex space-x-3">
                            <a href="/social-404" className="text-muted-foreground hover:text-foreground">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="/social-404" className="text-muted-foreground hover:text-foreground">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                            <a href="/social-404" className="text-muted-foreground hover:text-foreground">
                                <span className="sr-only">GitHub</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 dark:border-gray-700 my-8"></div>

                {/* Copyright */}
                <div className="text-center text-muted-foreground text-sm">
                    {t('footer.copyright', { year: currentYear })}
                </div>
            </div>
        </footer>
    )
} 